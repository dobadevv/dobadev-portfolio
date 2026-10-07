export interface Project {
  title: string
  url: string
  subtitle: string
  description: string
  tags: string[]
}

export const projects: Project[] = [
  {
    title: 'Marsvenus Connection',
    url: 'https://connection.marsvenus.vn/login',
    subtitle: 'Dating & connection platform',
    description:
      'A platform where people post invitations and apply to others to connect and date. Go backend on chi + sqlc + pgx/v5 with goose migrations, and MinIO object storage using a dual-endpoint presigned-URL pattern for secure, correct media delivery across environments.',
    tags: ['Go', 'chi', 'sqlc', 'pgx/v5', 'goose', 'Next.js', 'MinIO'],
  },
  {
    title: 'Smartnews',
    url: 'https://news.dobadev.io.vn',
    subtitle: 'AI-powered RSS aggregator with LLM translation',
    description:
      'An RSS/Atom aggregator that watches configurable feeds — engineering blogs, AI news, markets, world news — deduplicates against a Postgres store, then translates and summarizes each article into Vietnamese with an LLM (Gemini or Groq) before pushing to Discord and Telegram. Microservice architecture wired through RabbitMQ fan-out, a crawler for content extraction, and a Next.js frontend serving the curated articles.',
    tags: ['Python', 'PostgreSQL', 'RabbitMQ', 'LLM', 'Next.js'],
  },
  {
    title: 'goq',
    url: 'https://github.com/dobadevv/goq',
    subtitle: 'A message broker built from scratch',
    description:
      'A RabbitMQ-style TCP message broker built to understand brokers end-to-end. Observer-pattern fan-out, SQLite persistence, and a length-prefixed JSON wire protocol — shipped with an importable client library and an installable CLI.',
    tags: ['Go', 'TCP', 'SQLite', 'Observer pattern'],
  },
  {
    title: 'rmqtui',
    url: 'https://github.com/dobadevv/rmqtui',
    subtitle: 'A terminal UI for managing RabbitMQ',
    description:
      'A keyboard-driven TUI for RabbitMQ that browses queues, exchanges, and bindings and lets you create, bind, purge, and publish without leaving the terminal. Peeks messages non-destructively via basic_get with requeue and tails queues in real time, talking to both the AMQP protocol and the management HTTP API. Ships as prebuilt binaries and on crates.io.',
    tags: ['Rust', 'TUI', 'RabbitMQ', 'AMQP'],
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
