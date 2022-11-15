import yaml from 'js-yaml';
import { getOctokit } from '@actions/github';

interface RepoInfo {
  owner: string;
  repo: string;
}

export interface Config {
  [k: string]: string | string[];
}

export default async function getConfig(
  github: ReturnType<typeof getOctokit>['rest'],
  path: string,
  { owner, repo }: RepoInfo,
  ref: string,
  defaultConfig: Config
): Promise<Config> {
  try {
    const response = await github.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });

    if ('content' in response.data) {
      return parseConfig(response.data.content);
    }

    throw new Error(`${path} does not point to a config file`);
  } catch (error: any) {
    if (error.status === 404) {
      // TODO: add log
      return defaultConfig;
    }

    throw error;
  }
}

function parseConfig(content: string): { [key: string]: string | string[] } {
  return yaml.safeLoad(Buffer.from(content, 'base64').toString()) || {};
}

function err() {}
