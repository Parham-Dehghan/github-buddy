const { createOctokitClient } = require('../utils/github');

const octokit = createOctokitClient();

async function checkForChanges(repo) {
  try {
    const [owner, repoName] = repo.split('/');
    const { data: commits } = await octokit.repos.listCommits({ owner, repo: repoName });
    return {
      latestCommit: {
        sha: commits[0].sha,
        message: commits[0].commit.message,
        author: commits[0].commit.author.name,
      },
    };
  } catch (error) {
    throw new Error(`Error checking for changes: ${error.message}`);
  }
}

async function sendNotification(repo) {
  const chalk = require('chalk');
  const ora = require('ora');
  const notifier = require('node-notifier');
  const spinner = ora(`Setting up notifications for ${repo}...`).start();
  try {
    const [owner, repoName] = repo.split('/');
    await octokit.repos.get({ owner, repo: repoName });
    spinner.succeed(`Watching ${repo} for changes`);

    let lastCommitSha = null;
    setInterval(async () => {
      const { latestCommit } = await checkForChanges(repo);
      if (lastCommitSha && lastCommitSha !== latestCommit.sha) {
        notifier.notify({
          title: `New Commit in ${repo}`,
          message: `Commit: ${latestCommit.message}\nBy: ${latestCommit.author}`,
        });
        console.log(chalk.green(` New commit: ${latestCommit.message}`));
      }
      lastCommitSha = latestCommit.sha;
    }, 60000);
  } catch (error) {
    spinner.fail('Error setting up notifications');
    console.error(chalk.red(error.message));
  }
}

module.exports = { sendNotification, checkForChanges };