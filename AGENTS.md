# AGENTS.md

This repository is developed incrementally.

When modifying it, prioritize small, reviewable, reversible, and safe changes.

## Instruction priority

Follow instructions in this order:

1. The user’s current request.
2. This `AGENTS.md`.
3. An approved project plan such as `plano.md`.
4. Existing repository conventions.
5. General best practices.

If instructions conflict or a decision would materially change the scope, stop and ask for clarification.

## Core principles

* Prefer the smallest change that fully solves the requested problem.
* Do not refactor unrelated code.
* Do not implement features that were not requested.
* Preserve existing behavior unless the task explicitly changes it.
* Preserve existing content, data, translations, URLs, and public interfaces unless explicitly requested.
* Do not rename files, folders, variables, routes, or components without a clear reason.
* Reuse existing patterns before introducing new abstractions.
* Keep implementations simple and easy to understand.
* Avoid speculative architecture and premature optimization.
* Make changes easy to review and revert.

When uncertain, prefer:

**small change, small diff, easy review.**

## Before starting

Before editing:

1. Read this `AGENTS.md` completely.
2. Look for additional instructions in nested `AGENTS.md` files.
3. Read relevant documentation such as:

   * `README.md`
   * `plano.md`
   * architecture documents
   * deployment documentation
4. Inspect the files directly related to the task.
5. Check the repository state:

```bash
git status
git branch --show-current
git diff
```

6. Identify the package manager, build system, test framework, and deployment strategy already used by the repository.

Do not assume the stack based only on filenames or previous projects.

## Existing user changes

Existing changes belong to the user.

If the working tree already contains changes:

* do not discard them;
* do not overwrite them;
* do not stash them without permission;
* do not include them in your commits unless they are part of the requested task;
* do not use them as an excuse to reset the repository.

If the changes overlap with the requested work and cannot be safely isolated, stop and explain the conflict.

## Planning files

If a `plano.md`, `PLAN.md`, specification, issue, or implementation checklist exists:

* read it completely before editing;
* treat approved decisions as project requirements;
* execute only the requested stage;
* do not automatically continue to later stages;
* respect dependencies and acceptance criteria;
* update progress only after the stage has been successfully validated;
* do not mark a deployment as complete until its URL has been verified;
* stop after completing the requested stage and wait for approval.

If the plan is outdated or contradicts the repository, document the discrepancy before proceeding.

Do not rewrite the whole plan when only a status, commit, result, or deploy reference needs updating.

## Scope control

Before editing, define the smallest relevant scope.

Only modify files directly related to the requested task, unless another change is technically required.

If a task can be completed in one or two files, do not change ten.

Root configuration, shared packages, CI/CD, authentication, dependencies, and deployment configuration should only be modified when the task genuinely requires it.

Do not combine unrelated cleanup with feature work.

If you notice unrelated problems, mention them separately instead of fixing them automatically.

## Git workflow

For every task that requires repository changes:

1. Check that the working tree can be safely used.
2. Fetch the latest remote state.
3. Start from the latest `main`, unless the user specifies another base branch.
4. Create a descriptive branch.
5. Make changes only on that branch.
6. Never commit directly to `main`.
7. Never force-push `main`.
8. Never rewrite shared Git history unless explicitly requested.

Preferred workflow:

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c <branch-name>
```

Do not run this sequence blindly when the working tree contains local changes.

If local `main` cannot be safely updated, report the situation and use a safe alternative only when it does not risk user work.

### Branch naming

Use a descriptive lowercase branch name:

```text
feat/add-gallery-filters
fix/mobile-header-overlap
refactor/gallery-layout
chore/update-deploy-workflow
docs/add-project-plan
test/add-contact-form-tests
```

Recommended prefixes:

* `feat/` — new functionality
* `fix/` — bug fix
* `refactor/` — restructuring without intentional behavior changes
* `chore/` — maintenance or configuration
* `docs/` — documentation
* `test/` — tests only
* `perf/` — performance improvement
* `style/` — visual changes without functional changes

Do not create multiple branches for a single small task unless requested.

## Commit discipline

Keep commits small and focused.

Each commit should represent one logical change that can be reviewed and reverted independently.

Avoid commits containing:

* unrelated formatting changes;
* unrelated refactors;
* debugging code;
* temporary files;
* secrets;
* environment files;
* dependency changes unrelated to the task;
* generated output that should not be tracked;
* cache files;
* accidental lockfile changes.

Prefer multiple focused commits when a task contains clearly separate logical changes.

Do not artificially split a very small change into many commits.

Only create commits, push branches, open pull requests, or deploy when requested by the user or required by an approved project plan.

## Commit messages

Use Conventional Commits.

Examples:

```text
fix: prevent mobile header controls from overlapping

feat: add keyboard navigation to the gallery

style: update portfolio color palette

refactor: replace gallery layout styles

perf: add responsive artwork images

chore: fix GitHub Pages build output

docs: add visual refactoring plan

test: add contact form validation tests
```

Keep the subject concise, imperative, and specific to the actual change.

Do not use vague messages such as:

```text
update files
fix stuff
changes
work in progress
```

## Existing architecture

Before introducing a new pattern:

1. inspect similar code in the repository;
2. identify the current convention;
3. reuse it where reasonable;
4. introduce a new approach only when it clearly improves the requested area.

Consistency with the repository is normally preferable to a theoretically better architecture.

When replacing an existing pattern, migrate incrementally and avoid leaving multiple permanent solutions for the same problem.

## Dependencies

Do not add, remove, or upgrade dependencies without a clear reason.

Before adding a dependency, check whether the task can be solved using:

* the language standard library;
* existing project dependencies;
* browser or platform APIs;
* existing utilities;
* a small local implementation.

Use the package manager indicated by the repository lockfile:

* `package-lock.json` → npm
* `pnpm-lock.yaml` → pnpm
* `yarn.lock` → Yarn

Do not mix package managers or regenerate a lockfile with a different tool.

Do not perform broad dependency upgrades as part of unrelated work.

When adding a dependency, explain why it is necessary.

## Frontend

When modifying frontend code:

* preserve the existing content and functionality;
* maintain responsive behavior;
* test desktop and mobile layouts;
* do not fix desktop by breaking mobile or vice versa;
* use semantic HTML;
* preserve or improve accessibility;
* keep interactive controls keyboard accessible;
* provide visible focus states;
* respect `prefers-reduced-motion`;
* avoid unnecessary state and effects;
* avoid unnecessary client-side rendering;
* prevent layout shifts where practical;
* reuse existing design tokens and styling conventions;
* preserve translations and locale behavior.

Do not add a new styling system without a migration strategy.

Avoid permanently mixing multiple competing styling approaches such as:

* global CSS;
* CSS Modules;
* CSS-in-JS;
* component-library inline styles;
* Tailwind CSS.

Temporary coexistence is acceptable during an approved incremental migration.

For frameworks with server and client components:

* preserve existing boundaries;
* do not add client-only directives unless necessary;
* avoid hydration differences;
* do not access browser-only APIs during server rendering.

## Visual changes

For visual refactoring:

* preserve the product’s identity and content;
* define or reuse design tokens;
* avoid isolated one-off colors and spacing values;
* preserve readable contrast;
* avoid animations that interfere with usability;
* verify the result in the rendered application;
* compare relevant states before and after the change;
* inspect responsive layouts, overflow, focus states, loading states, and empty states.

Do not redesign unrelated sections while implementing one approved stage.

When the task follows a visual plan, complete and deploy one stage at a time.

## Accessibility

Accessibility is part of the definition of done.

When relevant, verify:

* semantic heading hierarchy;
* accessible names;
* keyboard navigation;
* focus order;
* visible focus indicators;
* color contrast;
* form labels and error messages;
* modal focus management;
* screen-reader semantics;
* reduced-motion preferences;
* adequate interactive target sizes.

Do not remove existing accessibility behavior during visual refactoring.

## Backend

When modifying backend code:

* preserve public API contracts unless explicitly requested;
* keep endpoints and handlers small;
* validate inputs at system boundaries;
* reuse existing service and helper layers;
* reuse existing error handling and logging patterns;
* avoid leaking internal errors or secrets;
* avoid unnecessary framework abstractions;
* maintain backward compatibility where required.

Do not silently change:

* authentication;
* authorization;
* database schemas;
* external integrations;
* response formats;
* environment-variable names;
* cloud-resource configuration.

Changes involving migrations or public contracts must be clearly documented.

## AI integrations

AI-related features must be implemented explicitly and incrementally.

Do not automatically add:

* agents;
* RAG;
* vector databases;
* embeddings;
* MCP;
* tool calling;
* new model providers;
* new cloud resources;
* new model deployments;
* new AI SDKs.

Do not replace an existing AI integration merely because another option is newer.

When modifying an AI feature:

* preserve existing prompts and output contracts unless requested;
* use structured outputs where the project already expects them;
* consider token usage and cost;
* handle provider failures safely;
* avoid logging sensitive prompt or user content;
* make model and deployment configuration explicit.

## Environment variables and secrets

Never commit secrets.

Do not commit:

```text
.env
.env.local
.env.production
credentials files
API keys
client secrets
access tokens
private keys
connection strings
```

Use `.env.example` to document required variables.

Placeholder values must clearly be placeholders.

Never print secrets in logs, terminal output, documentation, commits, pull requests, or final responses.

Before committing, inspect the diff for accidentally exposed credentials.

## Formatting

Preserve the surrounding code style.

Do not reformat entire files unless required by the task or formatter.

Avoid commits where the actual change is hidden among unrelated formatting modifications.

Run an existing formatter only on relevant files unless the repository explicitly requires full-project formatting.

## Generated and ignored files

Respect `.gitignore`.

Do not commit generated or cache files unless the repository intentionally tracks them:

```text
node_modules/
.next/
dist/
build/
coverage/
__pycache__/
*.pyc
.venv/
.cache/
.DS_Store
```

If the repository intentionally tracks build output, document that fact instead of changing the convention during an unrelated task.

## Validation

After making changes, run the smallest relevant validation that gives confidence in the result.

Use scripts already defined by the repository.

Possible frontend validations:

```bash
npm run lint
npm run test
npm run build
```

Possible backend validations:

```bash
python -m pytest
python -m compileall .
```

Also run targeted tests when available.

For visual work:

* start or inspect the rendered application;
* verify the affected area visually;
* test relevant desktop and mobile widths;
* verify keyboard interaction;
* check the browser console for errors.

Do not claim a command passed unless it was actually executed successfully.

Do not fix unrelated pre-existing errors unless they block the requested task.

If validation fails because of an unrelated existing issue:

* identify the command;
* report the relevant error;
* distinguish it from errors introduced by the current change;
* do not hide or misrepresent the result.

## Deployment

Do not deploy unless:

* the user explicitly requests it; or
* an approved plan requires a deploy for the current stage.

Before deploying:

1. run the relevant validation;
2. confirm the intended branch and environment;
3. inspect the diff;
4. confirm that no secrets or unintended files are included.

Prefer preview or staging deployments for work that has not been approved.

Do not deploy unapproved changes directly to production when a preview environment is available.

After deploying:

* verify that the deployment completed successfully;
* open the deployed application;
* verify the affected functionality;
* check for obvious runtime or asset-loading errors;
* report the exact deployment URL;
* identify the branch and commit deployed.

Do not describe a deployment as successful based only on a workflow starting.

If a staged plan requires approval after each deployment, stop after providing the URL and wait for the user.

## Before committing

Always inspect:

```bash
git status
git diff
git diff --staged
```

Check that:

* only expected files changed;
* no secrets were added;
* no generated files were accidentally added;
* no unrelated changes are included;
* the diff matches the requested scope;
* validation results are known.

## Pull requests

When asked to create a pull request:

* push the feature branch;
* create the PR against the requested base branch, normally `main`;
* use a clear title;
* keep the description concise;
* explain what changed and why;
* list the validation performed;
* include the preview URL when available;
* mention known limitations or follow-up work.

Suggested structure:

```markdown
## What changed

- ...

## Why

- ...

## Validation

- ...

## Preview

- ...
```

Do not merge a pull request unless explicitly requested.

Do not delete the branch unless requested or configured as an automatic repository policy.

## Destructive operations

Do not run destructive commands unless explicitly requested and the exact target is known.

Avoid commands such as:

```bash
git reset --hard
git clean -fd
git push --force
git checkout -- .
```

Never delete or overwrite user work merely to obtain a clean repository.

Prefer reversible operations.

## Final response

After completing a task, report:

* branch name;
* files changed;
* short implementation summary;
* validation performed and its result;
* commit hash and message, if created;
* deployment URL, if deployed;
* pull request link, if created;
* relevant limitations or unresolved issues.

Keep the final report concise and factual.

Never claim that a commit, push, deployment, test, or pull request succeeded unless the corresponding operation was verified.
