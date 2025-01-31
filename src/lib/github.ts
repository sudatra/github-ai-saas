import { Octokit } from 'octokit';

type Response = {
  commitMessage: string;
  commitHash: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
}

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
  
}