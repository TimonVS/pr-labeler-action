import getConfig from '../../src/utils/config';

describe('getConfig', () => {
  it('returns default config when GitHub returns a 404 for given path', async () => {
    const defaultConfig = {
      foo: 'bar',
    };

    const githubMock = {
      repos: {
        getContent() {
          throw new HTTPError(404);
        },
      },
    };

    const config = await getConfig(
      githubMock as any,
      'path/to/config',
      { owner: 'repo-owner', repo: 'repo-name' },
      'ref',
      defaultConfig
    );

    expect(config).toBe(defaultConfig);
  });
});

class HTTPError {
  constructor(public status: number) {}
}
