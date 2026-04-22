---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*)
description: Commit changes with auto-generated detailed commit message
argument-hint: <commit description (optional)>
---

# Commit

Analyze changes and commit with a detailed commit message.

## Current Status
- Branch: !`git branch --show-current`
- Status: !`git status --short`

## Behavior

### Case A: No argument
- Analyze all changes and auto-generate commit message
- Run `git add .` then commit

### Case B: With argument ($ARGUMENTS)
- Interpret argument as user's commit request
- If argument contains "closes #N" or "fixes #N", append to commit message body
- Selectively commit matching files or reflect the request in commit message

## Commit Message Format

```
<type>: <subject>

- bullet point 1
- bullet point 2
- bullet point 3
```

### Type Categories
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no functionality change)
- `docs`: Documentation changes
- `style`: Code formatting, semicolons, etc.
- `test`: Adding or modifying tests
- `chore`: Build scripts, config files, etc.

### Examples
```
feat: add login page
fix: resolve JWT token expiration bug
chore: update gitignore
refactor: improve meeting participation feature
```

**With issue closing:**
```
docs: complete GitHub Projects workflow setup

- Define folder structure (logs/, cases/)
- Add issue templates for service and education types
- Update workflow documentation

closes #5
```

### Body Writing Rules
- Maximum 3 bullet points
- Core changes only

## Execution Steps

1. Analyze changes with `git status` and `git diff`
2. Understand the content of changed files
3. Write appropriate type and detailed commit message
4. Run `git add` then commit

**Execute immediately without confirmation.**
