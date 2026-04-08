# Contributing Guidelines

Welcome to the project! To ensure a clear, readable, and maintainable project history, please adhere to the following conventions for branch naming and commit messages.

We follow a structured workflow based on [Conventional Commits](https://www.conventionalcommits.org/).

## Branch Naming Conventions

Branch names should be descriptive, lowercase, and hyphen-separated. They must start with a specific category prefix that defines the purpose of the branch.

### How to decide the branch name:

1. **Identify the intent:** Are you building a new feature, fixing a bug, or just updating docs?
2. **Select the prefix:** Use `feature/`, `bugfix/`, `hotfix/`, `docs/`, or `chore/`.
3. **Add a short description:** Use 2-4 hyphenated words that summarize the work. If there is an associated issue ticket, include the ticket number.

### Branch Name Format

`prefix/short-description` OR `prefix/issue-number-short-description`

### Examples

| Intent                                  | Branch Name Example               |
| :-------------------------------------- | :-------------------------------- |
| Building the date range selector        | `feature/date-range-selector`     |
| Fixing a mobile layout overflow         | `bugfix/mobile-calendar-overflow` |
| Urgent fix for a production crash       | `hotfix/fix-hydration-error`      |
| Updating the Readme instructions        | `docs/update-setup-guide`         |
| Upgrading Next.js to the latest version | `chore/upgrade-nextjs-version`    |

## Commit Message Conventions

Every commit message must be structural and communicate _what_ the commit does and _why_ it does it. This makes generating changelogs automatic and debugging much easier.

### How to decide the commit message:

1. **Determine the type:** What kind of change is this? (e.g., `feat`, `fix`, `refactor`).
2. **Identify the scope (Optional but recommended):** What part of the codebase is affected? (e.g., `calendar`, `notes`, `ui`).
3. **Write a concise subject:** Write a short, imperative sentence (act like you are giving an order to the codebase).
4. **Add a body (Optional):** If the commit is complex, add a blank line after the subject and explain the _why_ and _how_.

### Commit Message Format

```text
<type>(<scope>): <subject>

<body>
```

### Allowed Types

- **`feat:`** A new feature (e.g., adding the notes section).
- **`fix:`** A bug fix (e.g., fixing incorrect leap year calculations).
- **`refactor:`** Code changes that neither fix a bug nor add a feature (e.g., extracting a UI component).
- **`style:`** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- **`chore:`** Updating build tasks, package manager configs, etc; no production code change.
- **`docs:`** Documentation only changes.

### Subject Line Rules

- Use the imperative, present tense: "change" not "changed" nor "changes".
- Do not capitalize the first letter.
- No dot (.) at the end.

### Examples

**Good Commit (Feature):**

```text
feat(calendar): implement multi-day drag selection

Added Framer Motion to handle the drag gestures across the calendar grid.
Selected dates are now stored in the local state block.
```

**Good Commit (Fix):**

```text
fix(notes): prevent notes from being overwritten on month change

Adjusted the localStorage dependency array in the useEffect hook
so that current month notes are preserved when navigating to the next month.
```

**Good Commit (Chore):**

```text
chore: add prettier configuration file
```

### Bad Examples (What to Avoid)

- `fixed bug` _(Too vague, doesn't use the prefix correctly)_
- `feat: Added the new calendar UI.` _(Uses past tense, capitalized, has a period)_
- `wip` _(Never commit "work in progress" to main branches, squash these before merging)_
