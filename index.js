const distPath = './dist/index.js'
const errorMessage = `ERROR: pr-labeler-action is configured incorrectly. Please update .github/workflows/pr-labeler.yml to bind to a major version instead of master.

You can do so by changing:
- uses: TimonVS/pr-labeler-action@master

To:
- uses: TimonVS/pr-labeler-action@v3

Please check the repository (https://github.com/TimonVS/pr-labeler-action) for the latest version.
`

try {
  require(distPath)
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') {
    // Re-throw not "Module not found" errors
    throw error
  }
  if (error.message.indexOf(distPath) === -1) {
    // Re-throw not found errors for other modules
    throw error
  }

  console.error(errorMessage)
  throw error
}
