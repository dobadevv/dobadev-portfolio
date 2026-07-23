/// <reference types="node" />

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const styles = readFileSync(
  join(process.cwd(), 'src/components/Projects/Projects.module.css'),
  'utf8',
)

describe('Projects styles', () => {
  it('stretches reveal wrappers and project cards to the same grid row height', () => {
    expect(styles).toMatch(/\.grid\s*>\s*div\s*{[^}]*height:\s*100%;/s)
    expect(styles).toMatch(/\.card\s*{[^}]*height:\s*100%;/s)
  })
})
