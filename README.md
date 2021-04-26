# Hublo PR Labeler

A GitHub Action that automatically applies labels to your PRs based on commit message patterns like `feature*` or `fix*`.
Can be used in combination with [Release Drafter](https://github.com/toolmantim/release-drafter) to automatically [categorize pull requests](https://github.com/toolmantim/release-drafter#categorize-pull-requests).

- Please note that is it almost stolen from [TimonVS/pr-labeler-action](https://github.com/TimonVS/pr-labeler-action)

## Usage

Add `.github/workflows/hublo-pr-labeler.yml` with the following:

```yml
name: PR Labeler
on:
  pull_request:
    types: [opened]

jobs:
  pr-labeler:
    runs-on: ubuntu-latest
    steps:
      - uses: jonathanhublo/hublo-labeler-action@v1
        with:
          configuration-path: .github/hublo-pr-labeler.yml # optional, .github/hublo-pr-labeler.yml is the default value
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Configuration

Configure by creating a `.github/hublo-pr-labeler.yml` file.

For example:

```yml
feature: ['feature/*', 'feat/*']
fix: fix/*
chore: chore/*
fixed-branch: fixed-branch-name
```

Then if a pull request is opened with a message like `feat(emoji): add emoji support` the Action will automatically apply the `feature` label.

### Wildcard in configuration

You can use `*` as a wildcard for matching multiple names. See <https://www.npmjs.com/package/matcher> for more information about wildcard options.

### Default configuration

When no configuration is provided, the following defaults will be used:

```yml
feature: ['feature*', 'feat*', 'enhancement*'],
bug: 'fix*',
maintenance: ['chore*', 'style*', 'refactor*', 'build*', 'perf*', 'test*', 'ci*'],
documentation: 'docs*',
revert: 'revert*'
```

Contributions of any kind welcome!
