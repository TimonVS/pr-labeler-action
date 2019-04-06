const { Toolkit } = require('actions-toolkit')
const getConfig = require('./utils/config')
const wildcard = require('wildcard')

const CONFIG_FILENAME = 'pr-labeler.yml'
const defaults = {
  feature: ['feature/*', 'feat/*'],
  fix: 'fix/*',
  chore: 'chore/*'
}

Toolkit.run(
  async tools => {
    const repoInfo = {
      owner: tools.context.payload.repository.owner.login,
      repo: tools.context.payload.repository.name
    }

    const config = {
      ...defaults,
      ...(await getConfig(tools.github, CONFIG_FILENAME, repoInfo))
    }

    const labelsToAdd = Object.entries(config).reduce(
      (labels, [label, patterns]) => {
        if (
          Array.isArray(patterns)
            ? patterns.some(pattern => wildcard(pattern, tools.context.ref))
            : wildcard(patterns, tools.context.ref)
        ) {
          labels.push(label)
        }

        return labels
      },
      []
    )

    if (labelsToAdd.length > 0) {
      await tools.github.issues.addLabels({
        number: tools.context.payload.pull_request.number,
        labels: labelsToAdd,
        ...repoInfo
      })
    }

    tools.exit.success()
  },
  { event: 'pull_requests.created' }
)
