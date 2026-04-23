import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const distUrl = pathToFileURL(resolve(process.cwd(), 'dist', 'index.js')).href
let importCounter = 0

export async function loadDist() {
  return import(`${distUrl}?test=${importCounter++}`)
}
