export interface StackGroup {
  label: string
  items: string[]
}

export const stackGroups: StackGroup[] = [
  { label: 'Languages', items: ['Node.js/TypeScript', 'Go', 'Rust'] },
  { label: 'Backend', items: ['NestJS', 'Express.js', 'REST', 'GraphQL', 'chi', 'gin'] },
  { label: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
  { label: 'Messaging & async', items: ['Kafka', 'RabbitMQ', 'BullMQ'] },
  {
    label: 'Infra & DevOps',
    items: ['Docker', 'Nginx', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'AWS'],
  },
  { label: 'Frontend (secondary)', items: ['Next.js', 'React', 'Tailwind'] },
]
