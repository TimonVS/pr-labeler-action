const yaml = require('js-yaml')

/**
 * @returns {Promise<Object.<string, string | string[]>>}
 */
module.exports = async function getConfig(github, fileName, { owner, repo }, ref, defaultConfig) {
  try {
    const response = await github.repos.getContents({
      owner,
      repo,
      path: fileName,
      ref
    })

    return parseConfig(response.data.content)
  } catch (error) {
    if (error.code === 404) {
      return defaultConfig
    }

    throw error
  }
}

function parseConfig(content) {
  return yaml.safeLoad(Buffer.from(content, 'base64').toString()) || {}
}
