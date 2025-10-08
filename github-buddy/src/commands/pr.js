const { createOctokitClient } = require('../utils/github');

const octokit = createOctokitClient();

async function getPRs(repo) {
  try {
    const [owner, repoName] = repo.split('/');
    const { data: prs } = await octokit.pulls.list({ owner, repo: repoName });
    return prs.map(pr => ({
      number: pr.number,
      title: pr.title,
      author: pr.user.login,
      url: pr.html_url,
    }));
  } catch (error) {
    throw new Error(`Error fetching PRs: ${error.message}`);
  }
}

async function mergePRs(repo) {
  try {
    const [owner, repoName] = repo.split('/');
    const { data: prs } = await octokit.pulls.list({ owner, repo: repoName });
    const merged = [];
    for (const pr of prs) {
      await octokit.pulls.merge({ owner, repo: repoName, pull_number: pr.number });
      merged.push({ number: pr.number, title: pr.title });
    }
    return merged;
  } catch (error) {
    throw new Error(`Error merging PRs: ${error.message}`);
  }
}

async function managePR(repo, options) {
  const chalk = require('chalk');
  const ora = require('ora');
  const spinner = ora(`Fetching PRs for ${repo}...`).start();
  try {
    if (options.merge) {
      const merged = await mergePRs(repo);
      spinner.succeed(`Merged ${merged.length} PRs`);
      merged.forEach(pr => console.log(chalk.green(`✅ Merged PR #${pr.number}: ${pr.title}`)));
    } else {
      const prs = await getPRs(repo);
      spinner.succeed(`Found ${prs.length} PRs`);
      prs.forEach(pr => {
        console.log(`📋 PR #${pr.number}: ${chalk.cyan(pr.title)} (by ${pr.author})`);
        console.log(`🔗 ${pr.url}\n`);
      });
    }
  } catch (error) {
    spinner.fail('Error managing PRs');
    console.error(chalk.red(error.message));
  }
}

module.exports = { managePR, getPRs, mergePRs };