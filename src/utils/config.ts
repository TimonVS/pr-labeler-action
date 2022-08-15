import { GitHub } from '@actions/github';
import yaml from 'js-yaml';

interface RepoInfo {
  owner: string;
  repo: string;
}

type BranchPattern = string | string[];

type SpecificRefPatterns = {
  head: BranchPattern;
  base: BranchPattern;
};

export interface Config {
  [k: string]: BranchPattern | SpecificRefPatterns;
}

export default async function getConfig(
  github: GitHub,
  path: string,
  { owner, repo }: RepoInfo,
  ref: string,
  defaultConfig: Config
): Promise<Config> {
  try {
    const response = await github.repos.getContents({
      owner,
      repo,
      path,
      ref,
    });

    return parseConfig(response.data.content);
  } catch (error) {
    if (error.status === 404) {
      return defaultConfig;
    }

    throw error;
  }
}

function parseConfig(content: string): Config {
  return yaml.safeLoad(Buffer.from(content, 'base64').toString()) || {};
}
