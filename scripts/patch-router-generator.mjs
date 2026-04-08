import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

function patchEsm(file) {
  if (!existsSync(file)) return false
  const source = readFileSync(file, 'utf8')
  if (source.includes('export const CONSTANTS')) return false
  const patched = `${source}\n\n// Patched in CI: ensure named export exists for plugin compatibility\nexport const CONSTANTS = {}\n`
  writeFileSync(file, patched, 'utf8')
  return true
}

function patchCjs(file) {
  if (!existsSync(file)) return false
  const source = readFileSync(file, 'utf8')
  if (source.includes('exports.CONSTANTS')) return false
  const patched = `${source}\n\n// Patched in CI: ensure named export exists for plugin compatibility\nexports.CONSTANTS = {}\n`
  writeFileSync(file, patched, 'utf8')
  return true
}

try {
  const pkgJsonPath = require.resolve('@tanstack/router-generator/package.json')
  const pkgDir = dirname(pkgJsonPath)
  const esmPath = join(pkgDir, 'dist/esm/index.js')
  const cjsPath = join(pkgDir, 'dist/cjs/index.cjs')

  const esmPatched = patchEsm(esmPath)
  const cjsPatched = patchCjs(cjsPath)

  if (esmPatched || cjsPatched) {
    console.log('[postinstall] patched @tanstack/router-generator export: CONSTANTS')
  } else {
    console.log('[postinstall] no router-generator patch needed')
  }
} catch {
  console.log('[postinstall] @tanstack/router-generator not found, skipping patch')
}
