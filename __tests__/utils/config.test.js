const getConfig = require('../../src/utils/config')

describe('getConfig', () => {
  it('returns default config when GitHub returns a 404 for given path', async () => {
    const defaultConfig = {
      foo: 'bar'
    }

    const githubMock = {
      repos: {
        getContents() {
          const notFoundError = new Error()
          notFoundError.code = 404
          throw notFoundError
        }
      }
    }

    const config = await getConfig(githubMock, 'a', { owner: '', repo: '' }, null, defaultConfig)

    expect(config).toBe(defaultConfig)
  })
})
