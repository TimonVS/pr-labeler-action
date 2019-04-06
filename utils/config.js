const path = require('path')
const yaml = require('js-yaml')

const CONFIG_PATH = '.github'

/**
 * @returns {Promise<Object.<string, string | string[]>>}
 */
module.exports = async function getConfig(github, fileName, { owner, repo }) {
  try {
    const response = await github.repos.getContents({
      owner,
      repo,
      path: path.posix.join(CONFIG_PATH, fileName)
    })

    return parseConfig(response.data.content)
  } catch (error) {
    if (error.code === 404) {
      return null
    }

    throw error
  }
}

function parseConfig(content) {
  return yaml.safeLoad(Buffer.from(content, 'base64').toString()) || {}
}
