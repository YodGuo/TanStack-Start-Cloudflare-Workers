import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

function patchEsm(file) {
  if (!existsSync(file)) return false
  let source = readFileSync(file, 'utf8')
  let changed = false

  if (!source.includes('export const CONSTANTS')) {
    source += '\n\n// Patched in CI: ensure named export exists for plugin compatibility\nexport const CONSTANTS = {}\n'
    changed = true
  }

  if (!source.includes('export function startAPIRouteSegmentsFromTSRFilePath')) {
    source += '\nexport function startAPIRouteSegmentsFromTSRFilePath() { return [] }\n'
    changed = true
  }

  if (changed) writeFileSync(file, source, 'utf8')
  return changed
}

function patchCjs(file) {
  if (!existsSync(file)) return false
  let source = readFileSync(file, 'utf8')
  let changed = false

  if (!source.includes('exports.CONSTANTS')) {
    source += '\n\n// Patched in CI: ensure named export exists for plugin compatibility\nexports.CONSTANTS = {}\n'
    changed = true
  }

  if (!source.includes('exports.startAPIRouteSegmentsFromTSRFilePath')) {
    source += '\nexports.startAPIRouteSegmentsFromTSRFilePath = function startAPIRouteSegmentsFromTSRFilePath() { return [] }\n'
    changed = true
  }

  if (changed) writeFileSync(file, source, 'utf8')
  return changed
}

try {
  const pkgJsonPath = require.resolve('@tanstack/router-generator/package.json')
  const pkgDir = dirname(pkgJsonPath)
  const esmPath = join(pkgDir, 'dist/esm/index.js')
  const cjsPath = join(pkgDir, 'dist/cjs/index.cjs')

  const esmPatched = patchEsm(esmPath)
  const cjsPatched = patchCjs(cjsPath)

  if (esmPatched || cjsPatched) {
    console.log('[postinstall] patched @tanstack/router-generator compatibility exports')
  } else {
    console.log('[postinstall] no router-generator patch needed')
  }
} catch {
  console.log('[postinstall] @tanstack/router-generator not found, skipping patch')
}
