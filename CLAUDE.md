# CLIuno Nuxt template

Nuxt 4 + TypeScript app implementing the CLIuno demo app (auth, users, todos,
posts+comments, follows) against the shared CLIuno REST contract.

## Commands

```bash
pnpm dev        # nuxt dev on :5000
pnpm typecheck  # nuxt typecheck (vue-tsc)
pnpm build      # nuxt build
pnpm generate   # static generate
pnpm lint       # oxlint
pnpm format     # oxfmt .
```

## Structure

- `app/composables/use*Api.ts` — the API layer (`useAuthApi`, `useUserApi`, `useTodoApi`,
  `usePostApi`, `useFollowApi`) on `useHttp()`; base URL from
  `runtimeConfig.public.apiBase` (`NUXT_PUBLIC_API_BASE`, default
  `http://localhost:3000/api/v1`).
- Nuxt 4 layout: the app lives in `app/` (`app/pages/`, `app/components/`, `app/layouts/`,
  `app/middleware/`, `app/stores/` Pinia, `app/lib/`); `server/` and `public/` stay at the root.
  `~`/`@` resolve to `app/`.
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
  reka-ui primitives)** in `app/components/ui/`, css-variable theme, dark mode = `.dark`
  class; add with `npx shadcn-vue@latest add <name>`.

## AI agents (Claude Code and friends)

These commands need **cliuno 2.2 or newer** (`npx cliuno@^2.2` fetches it).

- **Check the CLIuno skills first**: `npx cliuno@^2.2 skills status` — if any is
  `missing`/`outdated`, run `npx cliuno@^2.2 skills install` (adds `.claude/skills/cliuno-*`:
  the generator workflow, the scaffold guide, and the shared REST contract).
- **Generate resources, don't hand-write them**:
  `npx cliuno@^2.2 make:resource Product --fields name:string,price:number,inStock:boolean`
  creates `app/composables/useProductApi.ts`, `app/pages/products/index.vue`, `app/pages/products/[id].vue`, following this
  template's conventions and the `{status, message, data}` contract. `--dry-run` previews,
  re-running never duplicates registrations, `--force` overwrites.
- Single pieces: `make:api`, `make:page`, `make:store`, `make:component` (→ `npx shadcn-vue@latest add`). `npx cliuno@^2.2 make` lists them.
- Then edit fields/business logic only, and run the gates above.
