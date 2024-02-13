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

permissions:
  contents: read

jobs:
  pr-labeler:
    permissions:
      contents: read # for TimonVS/pr-labeler-action to read config file
      pull-requests: write # for TimonVS/pr-labeler-action to add labels in PR
    runs-on: ubuntu-latest
    steps:
      - uses: TimonVS/pr-labeler-action@v5
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          configuration-path: .github/pr-labeler.yml # optional, .github/pr-labeler.yml is the default value
```

## Configuration

Configure by creating a `.github/pr-labeler.yml` file.

For example:

```yml
feature: ['feature/*', 'feat/*']
fix: fix/*
chore :hammer:: chore/*
```

Then if a pull request is opened with the branch name `feature/218-add-emoji-support` the Action will automatically apply the `feature` label.

Similarly, if a pull requests is opened with the branch name `fix/weird-bug` or `chore/annual-refactoring-job`, the Action will apply the `fix` or `chore 🔨` label, respectively.

If the label does not exist in your repo, a new one will be created (with no color and blank description), but it will not be permanently saved to the `github.com/<your_repo>/labels` page.

### Wildcard branches in configuration

You can use `*` as a wildcard for matching multiple branch names. See https://www.npmjs.com/package/matcher for more information about wildcard options.

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
