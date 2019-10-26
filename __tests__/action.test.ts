import nock from 'nock'
import fs from 'fs'
import action from '../src/action'

nock.disableNetConnect()

describe('pr-labeler-action', () => {
  it('adds the "fix" label for "fix/510-logging" branch', async () => {
    nock('https://api.github.com')
      .get('/repos/Codertocat/Hello-World/contents/.github/pr-labeler.yml?ref=fix%2F510-logging')
      .reply(200, configFixture())
      .post('/repos/Codertocat/Hello-World/issues/1/labels', body => {
        expect(body).toMatchObject({
          labels: ['fix']
        })
        return true
      })
      .reply(200)

    await action({
      payload: pullRequestOpenedFixture({ ref: 'fix/510-logging' })
    })
    expect.assertions(1)
  })

  it('adds the "feature" label for "feature/sign-in-page/101" branch', async () => {
    nock('https://api.github.com')
      .get('/repos/Codertocat/Hello-World/contents/.github/pr-labeler.yml?ref=feature%2Fsign-in-page%2F101')
      .reply(200, configFixture())
      .post('/repos/Codertocat/Hello-World/issues/1/labels', body => {
        expect(body).toMatchObject({
          labels: ['feature']
        })
        return true
      })
      .reply(200)

    await action({
      payload: pullRequestOpenedFixture({ ref: 'feature/sign-in-page/101' })
    })
    expect.assertions(1)
  })

  it('uses the default config when no config was provided', async () => {
    nock('https://api.github.com')
      .get('/repos/Codertocat/Hello-World/contents/.github/pr-labeler.yml?ref=fix%2F510-logging')
      .reply(404)
      .post('/repos/Codertocat/Hello-World/issues/1/labels', body => {
        expect(body).toMatchObject({
          labels: ['fix']
        })
        return true
      })
      .reply(200)

    await action({
      payload: pullRequestOpenedFixture({ ref: 'fix/510-logging' })
    })
    expect.assertions(1)
  })

  it("adds no labels if the branch doesn't match any patterns", async () => {
    nock('https://api.github.com')
      .get('/repos/Codertocat/Hello-World/contents/.github/pr-labeler.yml?ref=hello_world')
      .reply(200, configFixture())
      .post('/repos/Codertocat/Hello-World/issues/1/labels', body => {
        throw new Error("Shouldn't edit labels")
      })
      .reply(200)

    await action({
      payload: pullRequestOpenedFixture({ ref: 'hello_world' })
    })
  })
})

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
    content: encodeContent(fs.readFileSync(`./fixtures/${fileName}`)),
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

function pullRequestOpenedFixture({ ref }: { ref: string }) {
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
