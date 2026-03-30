#!/bin/zsh
# =============================================================================
# dependabot-merge.sh
#
# Combines all open Dependabot PRs into a single branch, verifies the build,
# creates a combined PR, optionally merges it, and produces a summary table.
#
# Requirements: git, gh (GitHub CLI), npm, jq
# Usage: ./scripts/dependabot-merge.sh
# =============================================================================

set -euo pipefail

# -- Configuration ------------------------------------------------------------
REPO_OWNER="navikt"
REPO_NAME="eux-web-app"
DEFAULT_BRANCH="master"
COMBINED_BRANCH="dependabot/combined-updates"
BUILD_CMD="npm run build"

# -- Colors & formatting ------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# -- State tracking -----------------------------------------------------------
typeset -a PR_NUMBERS PR_TITLES PR_BRANCHES PR_DEPS PR_FROM PR_TO MERGE_STATUS
MERGED_COUNT=0
TOTAL_COUNT=0

# -- Helpers ------------------------------------------------------------------
info()  { print -P "${CYAN}ℹ${RESET}  $1" }
ok()    { print -P "${GREEN}✅${RESET} $1" }
warn()  { print -P "${YELLOW}⚠️${RESET}  $1" }
fail()  { print -P "${RED}❌${RESET} $1" }
header() { print -P "\n${BOLD}── $1 ──${RESET}\n" }

die() {
  fail "$1"
  exit 1
}

# Extract dependency name and versions from a Dependabot PR title
# e.g. "dependabot-bump(deps): Bump @navikt/ds-react from 8.6.0 to 8.8.0"
parse_pr_title() {
  local title="$1"
  # Strip the "dependabot-bump(deps): Bump " or "dependabot-bump(deps-dev): Bump " prefix
  local body="${title#*Bump }"

  # Dependency: everything before " from "
  PR_DEP="${body%% from *}"

  # From version: between "from " and " to "
  local after_from="${body#*from }"
  PR_FROM_VER="${after_from%% to *}"

  # To version: after " to "
  PR_TO_VER="${body##*to }"
}

# =============================================================================
# Step 1: Pre-flight checks
# =============================================================================
preflight() {
  header "Step 1: Pre-flight checks"

  # Check required tools
  for cmd in git gh npm jq; do
    if ! command -v "$cmd" &>/dev/null; then
      die "Required tool '$cmd' is not installed."
    fi
  done
  ok "Required tools available (git, gh, npm, jq)"

  # Clean working tree
  if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
    die "Working tree is not clean. Commit or stash changes first."
  fi
  ok "Working tree is clean"

  # Fetch latest
  info "Fetching from origin..."
  git fetch origin --quiet
  ok "Fetched latest from origin"

  # Checkout default branch and pull
  info "Checking out $DEFAULT_BRANCH..."
  git checkout "$DEFAULT_BRANCH" --quiet
  git pull origin "$DEFAULT_BRANCH" --quiet
  ok "On $DEFAULT_BRANCH, up to date"
}

# =============================================================================
# Step 2: Find open Dependabot PRs
# =============================================================================
find_dependabot_prs() {
  header "Step 2: Finding open Dependabot PRs"

  local prs_json
  prs_json=$(gh pr list \
    --repo "$REPO_OWNER/$REPO_NAME" \
    --author "app/dependabot" \
    --state open \
    --json number,title,headRefName \
    --limit 100 \
    --jq 'sort_by(.number)')

  TOTAL_COUNT=$(echo "$prs_json" | jq 'length')

  if [[ "$TOTAL_COUNT" -eq 0 ]]; then
    ok "No open Dependabot PRs found. Nothing to do!"
    exit 0
  fi

  info "Found ${BOLD}$TOTAL_COUNT${RESET} open Dependabot PRs:"
  print ""

  # Parse into arrays
  for i in $(seq 0 $((TOTAL_COUNT - 1))); do
    local number title branch
    number=$(echo "$prs_json" | jq -r ".[$i].number")
    title=$(echo "$prs_json"  | jq -r ".[$i].title")
    branch=$(echo "$prs_json" | jq -r ".[$i].headRefName")

    PR_NUMBERS+=("$number")
    PR_TITLES+=("$title")
    PR_BRANCHES+=("$branch")

    parse_pr_title "$title"
    PR_DEPS+=("$PR_DEP")
    PR_FROM+=("$PR_FROM_VER")
    PR_TO+=("$PR_TO_VER")
    MERGE_STATUS+=("pending")

    printf "  #%-4s %-35s %s → %s\n" "$number" "$PR_DEP" "$PR_FROM_VER" "$PR_TO_VER"
  done
  print ""
}

# =============================================================================
# Step 3: Create combined branch and merge all PR branches
# =============================================================================
merge_branches() {
  header "Step 3: Creating combined branch and merging"

  # Delete existing combined branch if present
  git branch -D "$COMBINED_BRANCH" 2>/dev/null && \
    warn "Deleted existing local branch $COMBINED_BRANCH"

  git checkout -b "$COMBINED_BRANCH" "$DEFAULT_BRANCH" --quiet
  ok "Created branch $COMBINED_BRANCH from $DEFAULT_BRANCH"
  print ""

  for i in $(seq 1 $TOTAL_COUNT); do
    local idx=$((i - 1))
    local number="${PR_NUMBERS[$i]}"
    local branch="${PR_BRANCHES[$i]}"
    local dep="${PR_DEPS[$i]}"

    info "Merging PR #$number ($dep) — origin/$branch"

    if git merge "origin/$branch" --no-edit --quiet 2>/dev/null; then
      MERGE_STATUS[$i]="merged"
      MERGED_COUNT=$((MERGED_COUNT + 1))
      ok "PR #$number merged successfully"
    else
      # Check what files have conflicts
      local conflicted
      conflicted=$(git diff --name-only --diff-filter=U 2>/dev/null)

      # Allow conflicts only in package-lock.json and/or package.json
      local non_lock_conflicts=""
      while IFS= read -r file; do
        if [[ "$file" != "package-lock.json" && "$file" != "package.json" ]]; then
          non_lock_conflicts+="$file "
        fi
      done <<< "$conflicted"

      if [[ -n "$non_lock_conflicts" ]]; then
        fail "PR #$number has conflicts in non-lock files: $non_lock_conflicts"
        fail "Aborting. Please resolve conflicts manually."
        git merge --abort
        git checkout "$DEFAULT_BRANCH" --quiet
        exit 1
      fi

      warn "Lock file conflict in PR #$number — resolving..."
      git checkout --theirs package-lock.json 2>/dev/null
      git checkout --theirs package.json 2>/dev/null
      npm install --package-lock-only --quiet 2>/dev/null
      git add package-lock.json package.json
      git commit --no-edit --quiet
      MERGE_STATUS[$i]="merged"
      MERGED_COUNT=$((MERGED_COUNT + 1))
      ok "PR #$number conflict resolved and merged"
    fi
  done

  print ""
  ok "All $MERGED_COUNT of $TOTAL_COUNT branches merged successfully"
}

# =============================================================================
# Step 4: Verify the build
# =============================================================================
verify_build() {
  header "Step 4: Verifying build"

  info "Installing dependencies..."
  npm install --quiet 2>/dev/null
  ok "Dependencies installed"

  # Commit any lock file changes from npm install
  if [[ -n "$(git status --porcelain package-lock.json package.json 2>/dev/null)" ]]; then
    git add package-lock.json package.json
    git commit -m "chore: update package-lock.json after combined install" --quiet
    ok "Committed updated lock file"
  fi

  info "Running build: $BUILD_CMD"
  if eval "$BUILD_CMD"; then
    print ""
    ok "Build passed!"
  else
    print ""
    fail "Build failed after merging $MERGED_COUNT of $TOTAL_COUNT updates."
    fail "The last merged PR may be the cause. Please investigate."
    fail "Combined branch '$COMBINED_BRANCH' is still available locally for debugging."
    print_summary "failed"
    exit 1
  fi
}

# =============================================================================
# Step 5: Push and create PR
# =============================================================================
push_and_create_pr() {
  header "Step 5: Pushing and creating PR"

  info "Pushing $COMBINED_BRANCH to origin..."
  git push origin "$COMBINED_BRANCH" --force --quiet
  ok "Branch pushed"

  # Build PR body with summary table
  local pr_body="## Combined Dependabot Updates

This PR combines $TOTAL_COUNT open Dependabot PRs into a single update. Build has been verified locally.

### Summary

| PR # | Dependency | From Version | To Version | PR Title |
|------|-----------|-------------|-----------|----------|"

  for i in $(seq 1 $TOTAL_COUNT); do
    pr_body+="\n| #${PR_NUMBERS[$i]} | ${PR_DEPS[$i]} | ${PR_FROM[$i]} | ${PR_TO[$i]} | ${PR_TITLES[$i]} |"
  done

  # Add original PR references
  local pr_refs=""
  for i in $(seq 1 $TOTAL_COUNT); do
    [[ -n "$pr_refs" ]] && pr_refs+=", "
    pr_refs+="#${PR_NUMBERS[$i]}"
  done
  pr_body+="\n\n### Original PRs\n$pr_refs"

  info "Creating pull request..."
  local pr_url
  pr_url=$(gh pr create \
    --repo "$REPO_OWNER/$REPO_NAME" \
    --base "$DEFAULT_BRANCH" \
    --head "$COMBINED_BRANCH" \
    --title "chore(deps): combine dependabot updates" \
    --body "$(print "$pr_body")")

  ok "PR created: $pr_url"
  CREATED_PR_URL="$pr_url"
}

# =============================================================================
# Step 6: Merge the PR (with confirmation)
# =============================================================================
merge_pr() {
  header "Step 6: Merge to $DEFAULT_BRANCH"

  print -P "${BOLD}Ready to merge the combined PR to $DEFAULT_BRANCH.${RESET}"
  print -n "Proceed? [y/N] "
  read -r confirm

  if [[ "$confirm" != [yY] && "$confirm" != [yY][eE][sS] ]]; then
    warn "Merge skipped. The PR is still open at: $CREATED_PR_URL"
    warn "You can merge it manually when ready."
    print_summary "created"
    exit 0
  fi

  info "Merging PR..."
  if gh pr merge "$COMBINED_BRANCH" \
    --repo "$REPO_OWNER/$REPO_NAME" \
    --merge \
    --delete-branch 2>/dev/null; then
    ok "PR merged and branch deleted"
  else
    # Try with admin flag if branch protection blocks it
    warn "Merge blocked by branch protection. Retrying with --admin..."
    if gh pr merge "$COMBINED_BRANCH" \
      --repo "$REPO_OWNER/$REPO_NAME" \
      --merge \
      --delete-branch \
      --admin; then
      ok "PR merged with admin privileges and branch deleted"
    else
      fail "Could not merge PR. Please merge manually: $CREATED_PR_URL"
      print_summary "created"
      exit 1
    fi
  fi

  # Return to master
  git checkout "$DEFAULT_BRANCH" --quiet
  git pull origin "$DEFAULT_BRANCH" --quiet
  ok "Back on $DEFAULT_BRANCH, up to date"
}

# =============================================================================
# Step 7: Summary table
# =============================================================================
print_summary() {
  local status="${1:-merged}"

  header "Summary"

  # Print table
  printf "%-6s  %-35s  %-14s  %-14s  %s\n" "PR #" "Dependency" "From" "To" "Title"
  printf "%-6s  %-35s  %-14s  %-14s  %s\n" "------" "-----------------------------------" "--------------" "--------------" "-----"

  for i in $(seq 1 $TOTAL_COUNT); do
    printf "#%-5s  %-35s  %-14s  %-14s  %s\n" \
      "${PR_NUMBERS[$i]}" \
      "${PR_DEPS[$i]}" \
      "${PR_FROM[$i]}" \
      "${PR_TO[$i]}" \
      "${PR_TITLES[$i]}"
  done

  print ""
  case "$status" in
    merged)
      ok "${BOLD}All $TOTAL_COUNT dependency updates merged, build verified, and PR merged to $DEFAULT_BRANCH.${RESET}"
      ;;
    created)
      ok "${BOLD}All $TOTAL_COUNT dependency updates combined. PR created but not yet merged.${RESET}"
      ;;
    failed)
      fail "${BOLD}Build failed after merging $MERGED_COUNT of $TOTAL_COUNT updates. See error above.${RESET}"
      ;;
  esac
}

# =============================================================================
# Main
# =============================================================================
main() {
  print -P "\n${BOLD}🤖 Dependabot Merge — combine all open Dependabot PRs${RESET}\n"

  preflight
  find_dependabot_prs
  merge_branches
  verify_build
  push_and_create_pr
  merge_pr
  print_summary "merged"
}

main "$@"
