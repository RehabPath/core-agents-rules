#!/usr/bin/env node

import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import Ajv from 'ajv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const RULES_DIR = '.rulesync/rules'

// Load JSON schema
const schemaPath = join(__dirname, '..', 'rule-schema.json')
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))

// Initialize AJV
const ajv = new Ajv({ allErrors: true, verbose: true })
const validate = ajv.compile(schema)

let errors = []
let warnings = []

function validateRule(filePath) {
  const content = readFileSync(filePath, 'utf8')
  const fileName = filePath.split('/').pop()

  // Parse frontmatter
  let data
  try {
    const parsed = matter(content)
    data = parsed.data
  } catch (err) {
    errors.push(`${fileName}: Invalid YAML frontmatter - ${err.message}`)
    return
  }

  // Check if frontmatter exists
  if (!data || Object.keys(data).length === 0) {
    errors.push(`${fileName}: Missing frontmatter`)
    return
  }

  // Validate against JSON schema
  const valid = validate(data)

  if (!valid) {
    for (const error of validate.errors) {
      const path = error.instancePath || 'root'
      let message = `${fileName}: ${path} ${error.message}`

      // Add allowed values for enum errors
      if (error.keyword === 'enum' && error.params?.allowedValues) {
        message += ` (allowed: ${error.params.allowedValues.join(', ')})`
      }

      errors.push(message)
    }
  }

  // Additional warnings (not schema errors)
  if (data.root === true && !data.globs) {
    warnings.push(`${fileName}: Root rule without globs - consider adding globs: ["**/*"]`)
  }

  if (data.cursor?.alwaysApply === false && !data.globs && !data.cursor?.globs) {
    warnings.push(`${fileName}: Rule with alwaysApply: false but no globs defined - rule may never activate`)
  }
}

function main() {
  console.log('Validating rulesync rules against JSON schema...\n')

  let files
  try {
    files = readdirSync(RULES_DIR).filter(f => f.endsWith('.md'))
  } catch (err) {
    console.error(`Error: Cannot read ${RULES_DIR} directory`)
    console.error('Make sure you are running this from the project root')
    process.exit(1)
  }

  if (files.length === 0) {
    console.error(`Error: No rule files found in ${RULES_DIR}`)
    process.exit(1)
  }

  console.log(`Found ${files.length} rule file(s)\n`)

  for (const file of files) {
    validateRule(join(RULES_DIR, file))
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log('Warnings:')
    for (const warning of warnings) {
      console.log(`  ⚠️  ${warning}`)
    }
    console.log()
  }

  // Print errors
  if (errors.length > 0) {
    console.log('Errors:')
    for (const error of errors) {
      console.log(`  ❌ ${error}`)
    }
    console.log()
    console.log(`Validation failed with ${errors.length} error(s)`)
    process.exit(1)
  }

  console.log(`✅ All ${files.length} rule(s) are valid`)
}

main()
