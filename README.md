# PR Labeler

> A GitHub Action that automatically applies labels to your PRs based on branch name patterns like `feature/*` or `fix/*`.

## Usage

Configure by creating a `.github/pr-labeler.yml` file.

For example:

```yml
feature: ['feature/*', 'feat/*']
fix: fix/*
chore: chore/*
```

Then if a pull request is opened with the branch name `feature/218-add-emoji-support` the Action will automatically apply the `feature` label.
