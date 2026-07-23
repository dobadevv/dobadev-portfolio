export interface ContactEntry {
  label: string
  value: string
  href: string
  external?: boolean
}

export const contactEntries: ContactEntry[] = [
  { label: 'Email', value: 'duyanh.it.work@gmail.com', href: 'mailto:duyanh.it.work@gmail.com' },
  { label: 'GitHub', value: 'github.com/dobadevv', href: 'https://github.com/dobadevv', external: true },
  {
    label: 'LinkedIn',
    value: 'in/duyanhitbe',
    href: 'https://www.linkedin.com/in/duyanhitbe',
    external: true,
  },
  { label: 'Phone', value: '+84 944 609 933', href: 'tel:+84944609933' },
]
