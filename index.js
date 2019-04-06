const { Toolkit } = require('actions-toolkit')
const getConfig = require('./utils/config')
const wildcard = require('wildcard')

const CONFIG_FILENAME = 'pr-labeler.yml'
const defaults = {
  patterns: [
    { branch: 'feature/*', label: 'feature' },
    { branch: 'fix/*', label: 'fix' },
    { branch: 'chore/*', label: 'chore' }
  ]
}

Toolkit.run(
  async tools => {
    const repoInfo = {
      owner: tools.context.payload.repository.owner.login,
      repo: tools.context.payload.repository.name
    }

    const config = Object.assign(
      defaults,
      await getConfig(tools.github, CONFIG_FILENAME, repoInfo)
    )

    const labelsToAdd = config.patterns.reduce((labels, pattern) => {
      if (wildcard(pattern.branch, tools.context.ref)) {
        labels = labels.concat(pattern.label)
      }
      return labels
    }, [])

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
