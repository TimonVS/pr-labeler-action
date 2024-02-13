import * as core from '@actions/core';
import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';
import matcher from 'matcher';
import getConfig, { Config } from './utils/config';

const defaultConfig = {
  feature: ['feature/*', 'feat/*'],
  fix: 'fix/*',
  chore: 'chore/*',
};

async function action(context: Context = github.context) {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? core.getInput('repo-token', { required: true });
    const octokit = github.getOctokit(GITHUB_TOKEN).rest;
    const configPath = core.getInput('configuration-path', { required: true });
    const defaultLabel = core.getInput('default-label');

    if (!context.payload.pull_request) {
      throw new Error(
        "Payload doesn't contain `pull_request`. Make sure this Action is being triggered by a pull_request event (https://help.github.com/en/articles/events-that-trigger-workflows#pull-request-event-pull_request).",
      );
    }

    const ref: string = context.payload.pull_request.head.ref;
    const config = await getConfig(octokit, configPath, context.repo, ref, defaultConfig);
    const labelsToAdd = getLabelsToAdd(config, ref);

    if (labelsToAdd.length == 0 && defaultLabel) {
      labelsToAdd.push(defaultLabel);
    }

    if (labelsToAdd.length > 0) {
      await octokit.issues.addLabels({
        ...context.repo,
        issue_number: context.payload.pull_request.number,
        labels: labelsToAdd,
      });
    }
  } catch (error: any) {
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
    const matches = matcher(branchName, config[label]);

    if (matches.length > 0) {
      labelsToAdd.push(label);
    }
  }

  return labelsToAdd;
}

export default action;
