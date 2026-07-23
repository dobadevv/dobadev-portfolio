export interface DomainCard {
  code: string
  title: string
  problem: string
  shipped: string
}

export const domainCards: DomainCard[] = [
  {
    code: 'D-01',
    title: 'E-commerce & POS',
    problem:
      'Inventory, pricing, and order state have to stay correct across storefront, POS terminal, and backend at once.',
    shipped:
      'Built multi-tenant order and inventory flows that handle concurrent stock updates without overselling.',
  },
  {
    code: 'D-02',
    title: 'Distribution (DMS)',
    problem: 'The same order has to move through multiple warehouses and resellers without losing traceability.',
    shipped: 'Shipped a distribution management system tracking stock and orders across tiers of resellers.',
  },
  {
    code: 'D-03',
    title: 'Agriculture SaaS',
    problem: 'Concurrent writes to shared farm and batch records raced under load, corrupting state.',
    shipped: 'Solved a production race condition with row-level locking.',
  },
  {
    code: 'D-04',
    title: 'Game / Engagement',
    problem: 'Real-time giveaway games need fair, tamper-proof draws under concurrent play.',
    shipped:
      'Built a SaaS mini-game platform (Lucky Wheel, Card Flip) for restaurant giveaway campaigns — NestJS, PostgreSQL, RabbitMQ, Redis, WebSocket.',
  },
]
