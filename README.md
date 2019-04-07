# PR Labeler

A GitHub Action that automatically applies labels to your PRs based on branch name patterns like `feature/*` or `fix/*`.
Can be used in combination with [Release Drafter](https://github.com/toolmantim/release-drafter) to automatically [categorize pull requests](https://github.com/toolmantim/release-drafter#categorize-pull-requests).

## Usage

Add `.github/main.workflow` with the following:

```
workflow "Add label to PR" {
  on = "pull_request"
  resolves = "PR Labeler"
}

action "PR Labeler" {
  uses = "TimonVS/pr-labeler@master"
  secrets = ["GITHUB_TOKEN"]
}
```

## Configuration

Configure by creating a `.github/pr-labeler.yml` file.

For example:

```yml
feature: ['feature/*', 'feat/*']
fix: fix/*
chore: chore/*
```

Then if a pull request is opened with the branch name `feature/218-add-emoji-support` the Action will automatically apply the `feature` label.
