const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = 'input your token';

function createOctokitClient() {
  return new Octokit({ auth: GITHUB_TOKEN });
}

module.exports = { createOctokitClient };