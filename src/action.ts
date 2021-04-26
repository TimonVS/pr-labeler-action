import matcher from 'matcher'

import * as core from '@actions/core'
import * as github from '@actions/github'
import { Context } from '@actions/github/lib/context'

import getConfig, { Config } from './utils/config'

const defaultConfig = {
  feature: ['feature/*', 'feat/*'],
  fix: 'fix/*',
  chore: 'chore/*'
}

const action = async (context: Context = github.context) => {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
    const octokit = github.getOctokit(GITHUB_TOKEN)
    const configPath = core.getInput('configuration-path', { required: true })

    if (!context.payload.pull_request) {
      throw new Error(
        "Payload doesn't contain `pull_request`. Make sure this Action is being triggered by a pull_request event (https://help.github.com/en/articles/events-that-trigger-workflows#pull-request-event-pull_request)."
      )
    }

    const ref: string = context.payload.pull_request.head.ref
    const config = await getConfig(octokit, configPath, context.repo, ref, defaultConfig)
    const labelsToAdd = getLabelsToAdd(config, ref)

    if (labelsToAdd.length > 0) {
      console.log(`Adding those labels: ${labelsToAdd}`)
      await octokit.issues.addLabels({
        ...context.repo,
        issue_number: context.payload.pull_request.number,
        labels: labelsToAdd
      })
    } else {
      console.log('No label to add to this PR, moving on')
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'test') {
      throw error
    }

    core.error(error)
    core.setFailed(error.message)
  }
}

const getLabelsToAdd = (config: Config, branchName: string): string[] => {
  return Object.entries(config).reduce(
    (labels, [label, patterns]) => {
      if (
        Array.isArray(patterns)
          ? patterns.some(pattern => matcher.isMatch(branchName, pattern))
          : matcher.isMatch(branchName, patterns)
      ) {
        labels.push(label)
      }

      return labels
    },
    [] as string[]
  )
}

export default action
