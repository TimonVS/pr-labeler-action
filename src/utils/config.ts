import yaml from 'js-yaml'
import { GitHub } from '@actions/github'

interface RepoInfo {
  owner: string
  repo: string
}

export interface Config {
  [k: string]: string | string[]
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
      ref
    })

    return parseConfig(response.data.content)
  } catch (error) {
    if (error.status === 404) {
      return defaultConfig
    }

    throw error
  }
}

function parseConfig(content: string): { [key: string]: string | string[] } {
  return yaml.safeLoad(Buffer.from(content, 'base64').toString()) || {}
}
