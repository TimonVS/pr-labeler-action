import * as core from '@actions/core';
import * as github from '@actions/github';
import { Context } from '@actions/github/lib/context';
import matcher from 'matcher';

import getConfig, { Config } from './utils/config';
import { normalize } from './utils/normalize';

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

    const head: string = context.payload.pull_request.head.ref;
    const base: string = context.payload.pull_request.base.ref;
    const config = await getConfig(octokit, configPath, context.repo, head, defaultConfig);
    const labelsToAdd = getLabelsToAdd(config, head, base);

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

function getLabelsToAdd(config: Config, head: string, base: string): string[] {
  const labelsToAdd: string[] = [];

  for (const label in config) {
    const { base: basePatterns, head: headPatterns } = normalize(config[label]);
    const hasHeadPatterns = headPatterns.length > 0;
    const hasBasePatterns = basePatterns.length > 0;
    const headMatches = matcher(head, headPatterns).length > 0;
    const baseMatches = matcher(base, basePatterns).length > 0;

    if (
      (hasHeadPatterns && hasBasePatterns && headMatches && baseMatches) ||
      (hasBasePatterns && !hasHeadPatterns && baseMatches) ||
      (hasHeadPatterns && !hasBasePatterns && headMatches)
    ) {
      labelsToAdd.push(label);
    }
  }
  return labelsToAdd;
}

export default action;
