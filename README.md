# PR Labeler

A GitHub Action that automatically applies labels to your PRs based on branch name patterns like `feature/*` or `fix/*`.
Can be used in combination with [Release Drafter](https://github.com/toolmantim/release-drafter) to automatically [categorize pull requests](https://github.com/toolmantim/release-drafter#categorize-pull-requests).

## Usage

Add `.github/workflows/pr-labeler.yml` with the following:

```yml
name: Label PRs
on: [pull_request]
jobs:
  pr-labeler:
    runs-on: ubuntu-latest
    steps:
      - uses: TimonVS/pr-labeler@master
        if: github.event.action == 'opened'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Configuration

Configure by creating a `.github/pr-labeler.yml` file.

For example:

```yml
feature: ['feature/*', 'feat/*']
fix: fix/*
chore: chore/*
fixed-branch: fixed-branch-name
```

Then if a pull request is opened with the branch name `feature/218-add-emoji-support` the Action will automatically apply the `feature` label.

### Wildcard branches in configuration

You can use `*` as a wildcard for matching multiple branch names. See https://www.npmjs.com/package/matcher for more information about wildcard options.