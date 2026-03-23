---
name: dependabot-merge
description: >-
  Find all open Dependabot PRs, combine them into a single branch, verify the
  build, create a combined PR, merge to master, and produce a summary table.
---

# Dependabot Merge Skill

Combines all open Dependabot PRs into a single branch, verifies the build passes, creates a PR, merges it, and reports a summary.

## Safety rules — ALWAYS follow these

1. **Never force-push** to `master`. Only merge via PR after build verification.
2. **Abort on build failure**: If `npm run build` fails after applying changes, do NOT create or merge the PR. Report which dependency caused the failure and stop.
3. **Clean working tree**: Before starting, ensure the working tree is clean. Stash or abort if there are uncommitted changes.
4. **Confirm before merge**: Always ask the user for confirmation before merging the final PR to master.
5. **Do not delete Dependabot PRs**: Individual Dependabot PRs are left open — GitHub will auto-close them when their changes appear in master after merge.

## Repository context

- **Repo**: `navikt/eux-web-app`
- **Default branch**: `master`
- **Build command**: `npm run build`
- **Package manager**: npm (uses `package-lock.json`)

## Steps

### 1. Pre-flight checks

1. Ensure the git working tree is clean (`git status --porcelain`). If not, warn the user and stop.
2. Fetch latest from origin: `git fetch origin`.
3. Check out `master` and pull latest: `git checkout master && git pull origin master`.

### 2. Find open Dependabot PRs

1. Use the GitHub MCP tools to list open PRs authored by `dependabot[bot]` or `app/dependabot`:
   ```
   search_pull_requests(query: "is:open author:app/dependabot", owner: "navikt", repo: "eux-web-app")
   ```
2. If no Dependabot PRs are found, inform the user and stop.
3. For each PR, record: **PR number**, **title**, **branch name**, and **head SHA**.
4. Present the list to the user before proceeding.

### 3. Create the combined branch

1. Create and check out a new branch from `master`:
   ```bash
   git checkout -b dependabot/combined-updates master
   ```
   If the branch already exists, delete it first: `git branch -D dependabot/combined-updates`.

2. For each Dependabot PR branch (in order of PR number, ascending):
   - Merge the branch: `git merge origin/<branch-name> --no-edit`
   - If there is a **merge conflict**:
     - If the conflict is only in `package-lock.json`, resolve it by running:
       ```bash
       git checkout --theirs package-lock.json
       npm install
       git add package-lock.json package.json
       git commit --no-edit
       ```
     - If there are conflicts in other files, report the conflict to the user and stop.
   - Log which PR was merged successfully.

### 4. Verify the build

1. Install dependencies: `npm install` (in case lock file changed).
2. Run the build: `npm run build`.
3. If the build **fails**:
   - Report the failure output to the user.
   - Identify which dependency update likely caused it (the last merged PR or bisect if needed).
   - Do NOT proceed further. The user must fix the issue manually.
4. If the build **succeeds**, continue.

### 5. Push and create the PR

1. Push the combined branch:
   ```bash
   git push origin dependabot/combined-updates --force
   ```
2. Create a PR using the `gh` CLI:
   ```bash
   gh pr create \
     --base master \
     --head dependabot/combined-updates \
     --title "chore(deps): combine dependabot updates" \
     --body "<generated PR body with summary table>"
   ```
3. The PR body should include:
   - A short description explaining this combines Dependabot PRs.
   - The summary table (see Step 7).
   - A list of the original PR numbers as references (`#123`, `#124`, etc.).

### 6. Merge the PR

1. **Ask the user for confirmation** before merging.
2. If confirmed, merge:
   ```bash
   gh pr merge dependabot/combined-updates --merge --delete-branch
   ```
3. Switch back to master and pull:
   ```bash
   git checkout master && git pull origin master
   ```

### 7. Produce a summary table

Present a markdown table with the following columns:

| PR # | Dependency | From Version | To Version | PR Title |
|------|-----------|-------------|-----------|----------|

- **PR #**: The original Dependabot PR number (linked as `#123`).
- **Dependency**: The package name being updated (extracted from PR title).
- **From Version**: Previous version (extracted from PR title, e.g., "from 1.2.3").
- **To Version**: New version (extracted from PR title, e.g., "to 1.3.0").
- **PR Title**: The full original PR title.

Also include a final status line:
- ✅ **All N dependency updates merged, build verified, and PR merged to master.**
- Or ❌ **Build failed after merging N of M updates. See error above.**

## Error handling

- **Merge conflict in non-lock files**: Stop and report. Ask the user to resolve manually.
- **Build failure**: Stop and report. Show full error output. Suggest which PR may have caused it.
- **Network/auth errors**: Retry once, then report to user.
- **No Dependabot PRs found**: Inform user and exit gracefully.
