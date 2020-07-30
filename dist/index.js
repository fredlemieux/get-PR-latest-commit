const core = require("@actions/core");
const { Octokit } = require("@octokit/rest");
const exec = require("@actions/exec");
// const { Octokit } = require("@octokit/core");

async function run() {
    try {
      const token = core.getInput('token');
      const octokit = new Octokit({ auth: token });
//       const octokit = new Octokit({ auth: `${token}` });
      
      const repository = core.getInput('repository');
      const splitRepository = repository.split('/');
      if (splitRepository.length !== 2 ||
          !splitRepository[0] ||
          !splitRepository[1]) {
          throw new Error(`Invalid repository '${repository}'. Expected format {owner}/{repo}.`);
      }
      const repo_owner = splitRepository[0];
      const repo_name = splitRepository[1];
      const pr_number = core.getInput('pull-number');
      
      console.log(`repo_owner = ${repo_owner}`);
      console.log(`repo_name = ${repo_name}`);
      console.log(`pr_number = ${pr_number}`);
      
      const response = await octokit.pulls.listCommits({
        owner: repo_owner,
        repo: repo_name,
        pull_number: pr_number
      });
      
      const response_data = response.data;
      console.log(response_data);
      
      const length = await exec.exec(`bash echo "${response_data}" | jq 'length'`);
      console.log(length);
    }
    catch (error) {
      core.setFailed(error.message);
    }
  }
  run();
