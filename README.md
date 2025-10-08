GitHub Buddy
GitHub Buddy is a tool that combines a command-line interface (CLI) and a web interface to streamline your GitHub workflow. It allows you to manage repositories, view pull requests, and monitor repository changes efficiently. Built with Node.js, Express, and React, this project provides a practical solution for developers who want to interact with GitHub directly from their terminal or a browser.
Features

Dashboard: Displays a summary of your GitHub repositories, including star counts, fork counts, and recent commit messages.
Pull Request Management: Lists and merges pull requests for any specified repository.
Notifications: Monitors repository changes and provides web notifications for new commits.
Dual Interface: Offers both a colorful CLI for terminal users and a modern web interface styled with Tailwind CSS.
Single Command Execution: Run both the CLI and web server with a single command (node index.js).

Installation
Follow these steps to set up GitHub Buddy on your local machine:

Clone the Repository:
git clone https://github.com/Parham-Dehghan/github-buddy.git
cd github-buddy


Install Dependencies:Ensure you have Node.js (version 18 or higher) installed. Then, run:
npm install

This installs all required packages, including Express, Octokit, and others listed in package.json.

Configure GitHub Token:

Generate a GitHub Personal Access Token from GitHub Settings > Developer settings > Personal access tokens.
Select the repo and notifications scopes for the token.
Open the file src/utils/github.js and replace the placeholder token (ghp_YourFakeTokenHere1234567890) with your actual token:const GITHUB_TOKEN = 'your-actual-token-here';


Security Note: Do not share or commit your token to a public repository. If you plan to make the repository public, remove the token or use a .env file (not included in this setup).



Usage
Running the Application
To start both the CLI and web interface, run:
node index.js

This command:

Launches the Express server on http://localhost:3000 to serve the API and web interface.
Automatically opens your default browser to http://localhost:3000.
Enables CLI commands for terminal use.

Web Interface

Access the web interface at http://localhost:3000.
The dashboard displays up to five of your GitHub repositories with details like stars, forks, and recent commits.
To manage pull requests:
Enter a repository name in the format owner/repo (e.g., octocat/hello-world) in the provided text field.
Click "Fetch PRs" to list open pull requests.
Click "Merge All PRs" to merge all open pull requests for the specified repository.


Web notifications for new commits are displayed every minute if the browser grants permission.

CLI Commands
You can use the following commands in the terminal:
# View your GitHub dashboard
node index.js dashboard

# List pull requests for a repository
node index.js pr your-username/your-repo

# Merge all open pull requests for a repository
node index.js pr your-username/your-repo --merge

# Set up notifications for repository changes
node index.js notify your-username/your-repo

Project Structure
The project is organized as follows:
github-buddy/
├── src/
│   ├── commands/
│   │   ├── dashboard.js
│   │   ├── pr.js
│   │   └── notify.js
│   ├── utils/
│   │   ├── github.js
│   │   └── formatter.js
├── public/
│   ├── index.html
├── index.js
├── package.json
├── README.md

Security Considerations
Since the GitHub token is hardcoded in src/utils/github.js, avoid committing this file to a public repository. Consider using environment variables (e.g., a .env file) for a more secure setup if you plan to share the project publicly.
Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch:git checkout -b feature/your-feature


Commit your changes:git commit -m "Add your feature"


Push to the branch:git push origin feature/your-feature


Open a pull request on GitHub.

Please ensure your code follows the project's coding style and includes appropriate tests.
License
This project is licensed under the MIT License.
