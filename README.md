# PR Labeler

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)

A GitHub Action that automatically applies labels to your PRs based on branch name patterns like `feature/*` or `fix/*`.
Can be used in combination with [Release Drafter](https://github.com/toolmantim/release-drafter) to automatically [categorize pull requests](https://github.com/toolmantim/release-drafter#categorize-pull-requests).

## Usage

Add `.github/workflows/pr-labeler.yml` with the following:

```yml
name: PR Labeler
on:
  pull_request:
    types: [opened]

jobs:
  pr-labeler:
    runs-on: ubuntu-latest
    steps:
      - uses: TimonVS/pr-labeler-action@v3
        with:
          configuration-path: .github/pr-labeler.yml # optional, .github/pr-labeler.yml is the default value
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
```

Then if a pull request is opened with the branch name `feature/218-add-emoji-support` the Action will automatically apply the `feature` label.

### Wildcard branches in configuration

You can use `*` as a wildcard for matching multiple branch names. See https://www.npmjs.com/package/matcher for more information about wildcard options.

### Matching on the base branch

By default, labeler will match specified patterns againts the head branch. If you want to match against the base branch instead, you can do so by using the `base` option.

```yml
website:
  base: gh-pages
```

With the above configuration, if a pull request targeting the `gh-pages` branch is opened, the Action will automatically apply the `website` label regardless of its head branch name.

#### Matching on both the head and base branches

When both `head` and `base` options are specified, they will be combined in an "AND" statement. Meaning that the pull request needs to satisfy both head and base patterns in order to be attributed the label.

```yml
fix: 
  base: master
  head: fix/*
hot-fix:
  base: release/*
  head: fix/*
```

Suppose the above configuration and a pull request whose head branch name is `fix/510-logging`:

- If the PR is opened with `master` as target, the Action will add the "fix" label to it.
- If the PR is opened with `release/1.2.3` as target, the Action will add the "hot-fix" label to it.

### Default configuration

When no configuration is provided, the following defaults will be used:

```yml
feature: ['feature/*', 'feat/*']
fix: 'fix/*'
chore: 'chore/*'
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="http://www.timonvanspronsen.nl/"><img src="https://avatars2.githubusercontent.com/u/876666?v=4" width="100px;" alt="Timon van Spronsen"/><br /><sub><b>Timon van Spronsen</b></sub></a><br /><a href="https://github.com/TimonVS/pr-labeler-action/commits?author=TimonVS" title="Code">💻</a> <a href="#ideas-TimonVS" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/TimonVS/pr-labeler-action/commits?author=TimonVS" title="Tests">⚠️</a> <a href="https://github.com/TimonVS/pr-labeler-action/commits?author=TimonVS" title="Documentation">📖</a></td>
    <td align="center"><a href="http://clemensbastian.de"><img src="https://avatars2.githubusercontent.com/u/8781699?v=4" width="100px;" alt="Clemens Bastian"/><br /><sub><b>Clemens Bastian</b></sub></a><br /><a href="https://github.com/TimonVS/pr-labeler-action/commits?author=amacado" title="Code">💻</a> <a href="https://github.com/TimonVS/pr-labeler-action/commits?author=amacado" title="Documentation">📖</a> <a href="https://github.com/TimonVS/pr-labeler-action/issues?q=author%3Aamacado" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/hugo-vrijswijk"><img src="https://avatars3.githubusercontent.com/u/10114577?v=4" width="100px;" alt="Hugo van Rijswijk"/><br /><sub><b>Hugo van Rijswijk</b></sub></a><br /><a href="https://github.com/TimonVS/pr-labeler-action/commits?author=hugo-vrijswijk" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
