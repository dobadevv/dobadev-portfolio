export interface Project {
  title: string
  url: string
  subtitle: string
  description: string
  tags: string[]
}

export const projects: Project[] = [
  {
    title: 'goq',
    url: 'https://github.com/dobadevv/goq',
    subtitle: 'A message broker built from scratch',
    description:
      'A RabbitMQ-style TCP message broker built to understand brokers end-to-end. Observer-pattern fan-out, SQLite persistence, and a length-prefixed JSON wire protocol — shipped with an importable client library and an installable CLI.',
    tags: ['Go', 'TCP', 'SQLite', 'Observer pattern'],
  },
  {
    title: 'Marsvenus Connection',
    url: 'https://connection.dev.marsvenus.com.vn/en/login',
    subtitle: 'Anonymous dating & connection platform',
    description:
      'A platform where people post invitations and apply to others to connect and date anonymously. Go backend on chi + sqlc + pgx/v5 with goose migrations, and MinIO object storage using a dual-endpoint presigned-URL pattern for secure, correct media delivery across environments.',
    tags: ['Go', 'chi', 'sqlc', 'pgx/v5', 'goose', 'Next.js', 'MinIO'],
  },
  {
    title: 'eslint-plugin-go-fmt',
    url: 'https://github.com/dobadevv/eslint-plugin-go-fmt',
    subtitle: 'gofmt-style column alignment for ESLint',
    description:
      "An ESLint plugin that brings gofmt's struct-field column alignment to TypeScript and JavaScript, lining up the `:` and `=` in object literals, class bodies, interfaces, and type literals. Auto-fixable and Prettier-aware — it inserts a targeted `prettier-ignore` so the alignment survives `prettier --write`.",
    tags: ['TypeScript', 'ESLint', 'AST', 'Developer tooling'],
  },
]
