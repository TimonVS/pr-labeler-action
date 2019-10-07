const core = require('@actions/core')
const github = require('@actions/github')
const matcher = require('matcher')
const getConfig = require('./utils/config')

const CONFIG_FILENAME = 'pr-labeler.yml'
const defaults = {
  feature: ['feature/*', 'feat/*'],
  fix: 'fix/*',
  chore: 'chore/*'
}

async function action(context = github.context) {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const octokit = new github.GitHub(GITHUB_TOKEN)
    const repoInfo = {
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name
    }

    if (!context.payload.pull_request) {
      throw new Error(
        "Payload doesn't contain `pull_request`. Make sure this Action is being triggered by a pull_request event (https://help.github.com/en/articles/events-that-trigger-workflows#pull-request-event-pull_request)."
      )
    }

    const ref = context.payload.pull_request.head.ref;

    core.debug('MY DEBUG MESSAGE!!!!!!');

    var customConfig = await getConfig(octokit, CONFIG_FILENAME, repoInfo, ref);
    core.log(customConfig);
    core.debug(customConfig);

    const config = {
      ...defaults,
      ...customConfig
    }

    core.warning(config);
    const labelsToAdd = Object.entries(config).reduce(
      (labels, [label, patterns]) => {
        if (
          Array.isArray(patterns)
            ? patterns.some(pattern => matcher.isMatch(ref, pattern))
            : matcher.isMatch(ref, patterns)
        ) {
          labels.push(label)
        }

        return labels
      },
      []
    )

    if (labelsToAdd.length > 0) {
      await octokit.issues.addLabels({
        number: context.payload.pull_request.number,
        labels: labelsToAdd,
        ...repoInfo
      })
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'test') {
      throw error
    }

    core.error(error)
    core.setFailed(error.message)
  }
}

module.exports = action
