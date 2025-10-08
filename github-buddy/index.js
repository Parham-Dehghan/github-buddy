
const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const express = require('express');
const cors = require('cors');
const path = require('path');
const open = require('open'); 


const { getDashboardData, showDashboard } = require('./src/commands/dashboard');
const { getPRs, mergePRs, managePR } = require('./src/commands/pr');
const { checkForChanges, sendNotification } = require('./src/commands/notify');

const app = express();
const port = 3000;

// ==========================
// CLI Setup
// ==========================
console.log(chalk.cyan(figlet.textSync('GitHub Buddy', { horizontalLayout: 'full' })));

program
  .version('1.0.0')
  .description('A CLI and web tool to supercharge your GitHub workflow');

program
  .command('dashboard')
  .description('Show your GitHub activity dashboard')
  .action(showDashboard);

program
  .command('pr <repo>')
  .description('Manage pull requests for a repository (format: owner/repo)')
  .option('--merge', 'Merge open PRs')
  .action(managePR);

program
  .command('notify <repo>')
  .description('Set up notifications for repository changes (format: owner/repo)')
  .action(sendNotification);

// ==========================
// Server Setup
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/dashboard', async (req, res) => {
  try {
    const data = await getDashboardData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pr/:repo', async (req, res) => {
  try {
    const data = await getPRs(req.params.repo);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pr/:repo/merge', async (req, res) => {
  try {
    const data = await mergePRs(req.params.repo);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/notify/:repo', async (req, res) => {
  try {
    const data = await checkForChanges(req.params.repo);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================
// Start server and open browser
// ==========================
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  (async () => {
    try {
      await open(`http://localhost:${port}`);
    } catch (err) {
      console.error('Failed to open browser:', err);
    }
  })();
});

// ==========================
// Parse CLI commands
// ==========================
program.parse(process.argv);
