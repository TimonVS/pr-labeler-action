import * as core from '@actions/core';
import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';
import matcher from 'matcher';
import getConfig, { Config } from './utils/config';
import { arrayify } from './utils/arrayify';

const defaultConfig = {
  feature: ['feature/*', 'feat/*'],
  fix: 'fix/*',
  chore: 'chore/*',
};

async function action(context: Context = github.context) {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
    const octokit = new github.GitHub(GITHUB_TOKEN);
    const configPath = core.getInput('configuration-path', { required: true });

    if (!context.payload.pull_request) {
      throw new Error(
        "Payload doesn't contain `pull_request`. Make sure this Action is being triggered by a pull_request event (https://help.github.com/en/articles/events-that-trigger-workflows#pull-request-event-pull_request)."
      );
    }

    const ref: string = context.payload.pull_request.head.ref;
    const config = await getConfig(octokit, configPath, context.repo, ref, defaultConfig);
    const labelsToAdd = getLabelsToAdd(config, ref);

    if (labelsToAdd.length > 0) {
      await octokit.issues.addLabels({
        ...context.repo,
        number: context.payload.pull_request.number,
        labels: labelsToAdd,
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'test') {
      throw error;
    }

    core.error(error);
    core.setFailed(error.message);
  }
}

function getLabelsToAdd(config: Config, branchName: string): string[] {
  const labelsToAdd: string[] = [];

  for (const label in config) {
    const patterns = arrayify(config[label]);
    const matches = matcher([branchName], patterns);

    if (matches.length > 0) {
      labelsToAdd.push(label);
    }
  }

  return labelsToAdd;
}

export default action;
