const { createOctokitClient } = require('../utils/github');
const { formatDate } = require('../utils/formatter');

const octokit = createOctokitClient();

async function getDashboardData() {
  try {
    const { data: repos } = await octokit.repos.listForAuthenticatedUser();
    const dashboardData = [];
    for (const repo of repos.slice(0, 5)) {
      const { data: commits } = await octokit.repos.listCommits({ owner: repo.owner.login, repo: repo.name });
      dashboardData.push({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        lastCommit: commits[0]?.commit.message || 'No commits',
        updatedAt: formatDate(repo.updated_at),
      });
    }
    return dashboardData;
  } catch (error) {
    throw new Error(`Error fetching dashboard data: ${error.message}`);
  }
}

async function showDashboard() {
  const chalk = require('chalk');
  const ora = require('ora');
  const spinner = ora('Fetching GitHub activity...').start();
  try {
    const dashboardData = await getDashboardData();
    spinner.succeed('Fetched repositories!');
    console.log(chalk.bold.green('\nYour GitHub Dashboard:\n'));
    for (const repo of dashboardData) {
      console.log(` ${chalk.cyan(repo.name)}`);
      console.log(` Stars: ${repo.stars} | 🍴 Forks: ${repo.forks}`);
      console.log(` Last Commit: ${repo.lastCommit}`);
      console.log(` Updated: ${repo.updatedAt}\n`);
    }
  } catch (error) {
    spinner.fail('Error fetching data');
    console.error(chalk.red(error.message));
  }
}

module.exports = { showDashboard, getDashboardData };