#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageRoot = resolve(__dirname, '..')

// Get the project root where npm install was run
const projectRoot = process.env.INIT_CWD || process.cwd()

// Skip if we're installing in our own package (during development)
if (projectRoot === packageRoot) {
  console.log('[core-llm-rules] Skipping postinstall in package directory')
  process.exit(0)
}

console.log('[core-llm-rules] Setting up AI assistant rules...')

// Find rulesync binary - check multiple possible locations
function findRulesyncBin() {
  const possiblePaths = [
    // Package's own node_modules (if not hoisted)
    join(packageRoot, 'node_modules', '.bin', 'rulesync'),
    // Project's node_modules (if hoisted)
    join(projectRoot, 'node_modules', '.bin', 'rulesync'),
    // Try npx as fallback
    'npx rulesync'
  ]

  for (const binPath of possiblePaths) {
    if (binPath.startsWith('npx')) {
      return binPath
    }
    if (existsSync(binPath)) {
      return `"${binPath}"`
    }
  }
  
  // Last resort - use npx
  return 'npx rulesync'
}

try {
  // Step 1: Generate rules within this package using rulesync
  console.log('[core-llm-rules] Generating rules...')
  console.log(`[core-llm-rules] Package root: ${packageRoot}`)
  console.log(`[core-llm-rules] Project root: ${projectRoot}`)
  
  const rulesyncCmd = findRulesyncBin()
  console.log(`[core-llm-rules] Using: ${rulesyncCmd}`)
  
  try {
    execSync(`${rulesyncCmd} generate --targets cursor,claudecode --features rules`, {
      cwd: packageRoot,
      stdio: 'inherit',
      env: { ...process.env, PATH: process.env.PATH }
    })
  } catch (genError) {
    console.error('[core-llm-rules] Generation failed, trying npx...')
    execSync('npx -y rulesync generate --targets cursor,claudecode --features rules', {
      cwd: packageRoot,
      stdio: 'inherit'
    })
  }

  // Step 2: Copy generated .cursor directory to consumer project
  const sourceCursor = join(packageRoot, '.cursor')
  const targetCursor = join(projectRoot, '.cursor')

  if (existsSync(sourceCursor)) {
    mkdirSync(targetCursor, { recursive: true })
    cpSync(sourceCursor, targetCursor, { recursive: true })
    console.log('[core-llm-rules] Copied .cursor/ directory')
  } else {
    console.log('[core-llm-rules] Warning: .cursor/ not generated')
  }

  // Step 3: Copy generated .claude directory to consumer project
  const sourceClaude = join(packageRoot, '.claude')
  const targetClaude = join(projectRoot, '.claude')

  if (existsSync(sourceClaude)) {
    mkdirSync(targetClaude, { recursive: true })
    cpSync(sourceClaude, targetClaude, { recursive: true })
    console.log('[core-llm-rules] Copied .claude/ directory')
  } else {
    console.log('[core-llm-rules] Warning: .claude/ not generated')
  }

  console.log('[core-llm-rules] Setup complete!')
} catch (error) {
  console.error('[core-llm-rules] Error during setup:', error.message)
  console.error('[core-llm-rules] You may need to run manually: npx generate-llm-rules')
  // Don't fail the install if setup fails
  process.exit(0)
}
