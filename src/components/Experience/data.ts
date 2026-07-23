export interface ExperienceEntry {
  dateRange: string
  company: string
  role: string
  description: string
  current?: boolean
}

export const experienceEntries: ExperienceEntry[] = [
  {
    dateRange: 'Sep 2024 – Present',
    company: 'Finviet',
    role: 'Backend Engineer',
    description:
      'Building ECOPOS, a multi-tenant POS/e-commerce/DMS platform, from scratch with Clean Architecture — NestJS, Kafka, RabbitMQ, BullMQ, PostgreSQL, Redis, Elasticsearch.',
    current: true,
  },
  {
    dateRange: 'Jul 2023 – Aug 2024',
    company: 'GreenAgri',
    role: 'Backend Engineer',
    description:
      'Owned backend services for an agriculture SaaS platform, including tracking down and fixing a production race condition with row-level locking.',
  },
  {
    dateRange: 'Mar 2023 – Jul 2023',
    company: 'TAS Vietnam',
    role: 'Backend Developer',
    description: 'Built backend services and internal tooling for e-commerce operations.',
  },
  {
    dateRange: 'Nov 2022 – Mar 2023',
    company: 'EPlus Technology',
    role: 'Backend Developer',
    description: 'Delivered REST APIs powering client web platforms.',
  },
  {
    dateRange: 'Jan 2022 – Jun 2022',
    company: 'STECH',
    role: 'Backend Developer',
    description: 'First production experience building Node.js backend services.',
  },
]
