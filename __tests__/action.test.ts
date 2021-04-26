import fs from 'fs'
import nock from 'nock'
import path from 'path'

import { Context } from '@actions/github/lib/context'
import { WebhookPayload } from '@actions/github/lib/interfaces'

import action from '../src/action'

nock.disableNetConnect()

describe('pr-labeler-action', () => {
  beforeEach(() => {
    nock.cleanAll()
    setupEnvironmentVariables()
  })

  it('adds the "fix" label if a commit message match a custom config file', async () => {
    nock('https://api.github.com')
      .get('/repos/Codertocat/Hello-World/contents/.github%252Fhublo-pr-labeler.yml?ref=a')
      .reply(200, configFixture())
      .get('/repos/Codertocat/Hello-World/pulls/1')
      .reply(200, { title: 'fix/logging' })
      .post('/repos/Codertocat/Hello-World/issues/1/labels', body => {
        expect(body).toMatchObject({
          labels: ['fix']
        })
        return true
      })
      .reply(200)

    await action(new MockContext(pullRequestOpenedFixture('a')))
    expect.assertions(1)
  })

  it('adds the "feature" label if a commit message match a custom config file', async () => {
    nock('https://api.github.com')
      .get('/repos/Codertocat/Hello-World/contents/.github%252Fhublo-pr-labeler.yml?ref=b')
      .reply(200, configFixture())
      .get('/repos/Codertocat/Hello-World/pulls/1')
      .reply(200, { title: 'feature/something' })
      .post('/repos/Codertocat/Hello-World/issues/1/labels', body => {
        expect(body).toMatchObject({
          labels: ['🎉 feature']
        })
        return true
      })
      .reply(200)

    await action(new MockContext(pullRequestOpenedFixture('b')))
    expect.assertions(1)
  })

  it('adds the "feature" label for a commitizen formatted message', async () => {
    nock('https://api.github.com')
      .get('/repos/Codertocat/Hello-World/contents/.github%252Fhublo-pr-labeler.yml?ref=c')
      .reply(404)
      .get('/repos/Codertocat/Hello-World/pulls/1')
      .reply(200, { title: 'feat(something): something else' })
      .post('/repos/Codertocat/Hello-World/issues/1/labels', body => {
        expect(body).toMatchObject({
          labels: ['feature']
        })
        return true
      })
      .reply(200)

    await action(new MockContext(pullRequestOpenedFixture('c')))
    expect.assertions(1)
  })

  it('uses the default config when no config was provided', async () => {
    nock('https://api.github.com')
      .get('/repos/Codertocat/Hello-World/contents/.github%252Fhublo-pr-labeler.yml?ref=d')
      .reply(404)
      .get('/repos/Codertocat/Hello-World/pulls/1')
      .reply(200, { title: 'fix(bug): this is fixed' })
      .post('/repos/Codertocat/Hello-World/issues/1/labels', body => {
        expect(body).toMatchObject({
          labels: ['bug']
        })
        return true
      })
      .reply(200)

    await action(new MockContext(pullRequestOpenedFixture('d')))
    expect.assertions(1)
  })

  it("adds no labels if the branch doesn't match any patterns", async () => {
    nock('https://api.github.com')
      .get('/repos/Codertocat/Hello-World/contents/.github%252Fhublo-pr-labeler.yml?ref=e')
      .reply(404)
      .get('/repos/Codertocat/Hello-World/pulls/1')
      .reply(200, { title: 'this does not match anything' })
      .post('/repos/Codertocat/Hello-World/issues/1/labels', body => {
        throw new Error("Shouldn't edit labels")
      })
      .reply(200)

    await action(new MockContext(pullRequestOpenedFixture('e')))
  })
})

class MockContext extends Context {
  constructor(payload: WebhookPayload) {
    super()
    this.payload = payload
  }
}

function encodeContent(content: Buffer) {
  return Buffer.from(content).toString('base64')
}

function configFixture(fileName = 'config.yml') {
  return {
    type: 'file',
    encoding: 'base64',
    size: 5362,
    name: fileName,
    path: `.github/${fileName}`,
    content: encodeContent(fs.readFileSync(path.join(__dirname, `fixtures/${fileName}`))),
    sha: '3d21ec53a331a6f037a91c368710b99387d012c1',
    url: 'https://api.github.com/repos/octokit/octokit.rb/contents/.github/release-drafter.yml',
    git_url: 'https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1',
    html_url: 'https://github.com/octokit/octokit.rb/blob/master/.github/release-drafter.yml',
    download_url: 'https://raw.githubusercontent.com/octokit/octokit.rb/master/.github/release-drafter.yml',
    _links: {
      git: 'https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1',
      self: 'https://api.github.com/repos/octokit/octokit.rb/contents/.github/release-drafter.yml',
      html: 'https://github.com/octokit/octokit.rb/blob/master/.github/release-drafter.yml'
    }
  }
}

function pullRequestOpenedFixture(ref: string) {
  return {
    pull_request: {
      number: 1,
      head: {
        ref
      }
    },
    repository: {
      name: 'Hello-World',
      owner: {
        login: 'Codertocat'
      }
    }
  }
}

function setupEnvironmentVariables() {
  // reset process.env otherwise `Context` will use those variables
  // configuration-path parameter is required
  // parameters are exposed as environment variables: https://help.github.com/en/github/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#jobsjob_idstepswith
  process.env = {
    ['INPUT_CONFIGURATION-PATH']: '.github%2Fhublo-pr-labeler.yml',
    GITHUB_TOKEN: 'this cannot be empty'
  }
}
