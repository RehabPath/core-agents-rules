#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageRoot = resolve(__dirname, '..')

// Get the project root (current working directory)
const projectRoot = process.cwd()

console.log('[core-llm-rules] Generating AI assistant rules...')

try {
  // Try to run rulesync in the project directory first (if user has customized rules)
  const projectRulesync = join(projectRoot, '.rulesync')
  
  if (existsSync(projectRulesync)) {
    console.log('[core-llm-rules] Found .rulesync/ in project, generating from local rules...')
    execSync('npx rulesync generate --targets cursor,claudecode --features rules', {
      cwd: projectRoot,
      stdio: 'inherit'
    })
  } else {
    // Generate from package and copy
    console.log('[core-llm-rules] Generating from package rules...')
    const rulesyncBin = join(packageRoot, 'node_modules', '.bin', 'rulesync')
    execSync(`"${rulesyncBin}" generate --targets cursor,claudecode --features rules`, {
      cwd: packageRoot,
      stdio: 'inherit'
    })

    // Copy generated folders
    const sourceCursor = join(packageRoot, '.cursor')
    const targetCursor = join(projectRoot, '.cursor')
    if (existsSync(sourceCursor)) {
      mkdirSync(targetCursor, { recursive: true })
      cpSync(sourceCursor, targetCursor, { recursive: true })
      console.log('[core-llm-rules] Copied .cursor/ directory')
    }

    const sourceClaude = join(packageRoot, '.claude')
    const targetClaude = join(projectRoot, '.claude')
    if (existsSync(sourceClaude)) {
      mkdirSync(targetClaude, { recursive: true })
      cpSync(sourceClaude, targetClaude, { recursive: true })
      console.log('[core-llm-rules] Copied .claude/ directory')
    }
  }

  console.log('[core-llm-rules] Generation complete!')
} catch (error) {
  console.error('[core-llm-rules] Error:', error.message)
  process.exit(1)
}
