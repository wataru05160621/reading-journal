# Prisma Setup

This workspace manages the database schema.

## Prerequisites
- PostgreSQL database
- Node.js 18+
- Copy `.env.example` to `.env` and update `DATABASE_URL`.

## Commands
- Generate Client: `npm run db:generate`
- Run Dev Migration: `npm run db:migrate`
- Open Studio: `npm run db:studio`

These commands proxy to the `infra/prisma` workspace scripts.
