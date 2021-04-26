import yaml from 'js-yaml'

import { GitHub } from '@actions/github/lib/utils'

interface RepoInfo {
  owner: string
  repo: string
}

export type Config = Record<string, string | string[]>
type OctoType = InstanceType<typeof GitHub>

export default async function getConfig(
  github: OctoType,
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
      ref
    })

    return parseConfig((response.data as unknown as { content: string }).content)
  } catch (error) {
    if (error.status === 404) {
      return defaultConfig
    }

    throw error
  }
}

const parseConfig = (content: string): Config =>
  yaml.load(Buffer.from(content, 'base64').toString()) as Config || {}
