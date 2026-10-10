# CLIuno Nuxt template

Nuxt 4 + TypeScript app implementing the CLIuno demo app (auth, users, todos,
posts+comments, follows) against the shared CLIuno REST contract.

## Commands

```bash
pnpm dev        # nuxt dev on :5000
pnpm build      # nuxt build
pnpm generate   # static generate
pnpm lint       # oxlint
pnpm format     # oxfmt .
```

## Structure

- `composables/use*Api.ts` — the API layer (`useAuthApi`, `useUserApi`, `useTodoApi`,
  `usePostApi`, `useFollowApi`) on `useHttp()`; base URL from
  `runtimeConfig.public.apiBase` (`NUXT_PUBLIC_API_BASE`, default
  `http://localhost:3000/api/v1`).
- `pages/`, `components/`, `layouts/`, `middleware/` — Nuxt conventions; `stores/` Pinia.
- **Auto-imports are pervasive** (Nuxt composables + your own). `.oxlintrc.json` carries
  the generated names as `globals` so no-undef stays useful — regenerate from
  `.nuxt/imports.d.ts` + `.nuxt/components.d.ts` when they change.

## The API contract (what backends guarantee)

Login sends `{usernameOrEmail, password}` and reads `data.token`. Responses are
`{status, message, data}` with exact keys `data.users/user/todos/todo/posts/post/`
`followers/following/isFollowing`. Any CLIuno backend template serves this contract.
Keep all URLs inside the composables.

## Conventions

- oxc tooling: `oxlint` + `oxfmt` (`semi: false`, single quotes; `.prettierrc` matches);
  prettier only for css/md/json. No `@nuxt/eslint` — don't re-add it to `nuxt.config`.
- Conventional commits (commitlint + husky); Tailwind v4 + **shadcn-vue (shadcn-nuxt,
  reka-ui primitives)** in `components/ui/`, css-variable theme, dark mode = `.dark`
  class; add with `npx shadcn-vue@latest add <name>`.

## AI agents (Claude Code and friends)

- **Check the CLIuno skills first**: `npx cliuno@latest skills status` — if any is
  `missing`/`outdated`, run `npx cliuno@latest skills install` (adds `.claude/skills/cliuno-*`:
  the generator workflow, the scaffold guide, and the shared REST contract).
- **Generate resources, don't hand-write them**:
  `npx cliuno@latest make:resource Product --fields name:string,price:number,inStock:boolean`
  creates `composables/useProductApi.ts`, `pages/products/index.vue`, `pages/products/[id].vue`, following this
  template's conventions and the `{status, message, data}` contract. `--dry-run` previews,
  re-running never duplicates registrations, `--force` overwrites.
- Single pieces: `make:api`, `make:page`, `make:store`, `make:component` (→ `npx shadcn-vue@latest add`). `npx cliuno@latest make` lists them.
- Then edit fields/business logic only, and run the gates above.
