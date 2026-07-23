/// <reference types="node" />

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const styles = readFileSync(join(process.cwd(), 'src/components/Contact/Contact.module.css'), 'utf8')

describe('Contact styles', () => {
  it('keeps contact values on one line without overflowing their card', () => {
    expect(styles).toMatch(
      /\.grid\s*{[^}]*grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(min\(220px,\s*100%\),\s*1fr\)\);/s,
    )
    expect(styles).toMatch(/\.card\s*{[^}]*min-width:\s*0;/s)
    expect(styles).toMatch(/\.value\s*{[^}]*display:\s*block;/s)
    expect(styles).toMatch(/\.value\s*{[^}]*max-width:\s*100%;/s)
    expect(styles).toMatch(/\.value\s*{[^}]*white-space:\s*nowrap;/s)
    expect(styles).toMatch(/\.value\s*{[^}]*overflow:\s*hidden;/s)
    expect(styles).toMatch(/\.value\s*{[^}]*text-overflow:\s*ellipsis;/s)
  })
})
