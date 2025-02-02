import { db } from '@/server/db';
import { Octokit } from 'octokit';
import axios from 'axios';
import { aiSummarizeCommit } from './gemini';

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
  const [ owner, repo ] = githubUrl.split('/').slice(-2);
  if(!owner || !repo) {
    throw new Error('Invalid Github URL');
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner: owner,
    repo: repo
  });

  const sortedCommits = data.sort((a: any, b: any) => (new Date(b.commit.author?.date).getTime() - new Date(a.commit.author?.date).getTime())) as any[]
  return sortedCommits.slice(0, 15).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message ?? '',
    commitAuthorName: commit.commit?.author?.name ?? '',
    commitAuthorAvatar: commit?.author?.avatar_url ?? '',
    commitDate: commit.commit?.author?.date ?? ''
  }));
}

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
  const commitSummaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => {
    return summarizeCommit(githubUrl, commit.commitHash);
  }))

  const commitSummaries = commitSummaryResponses.map((response) => {
    if(response.status === 'fulfilled') {
      return response.value;
    }

    return "";
  });

  const commits = await db.commit.createMany({
    data: commitSummaries.map((summary: any, index) => {
      return {
        projectId: projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[index]!.commitDate,
        summary
      }
    })
  });

  return commits;
}

const fetchProjectGithubUrl = async (projectId: string) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true }
  });

  if(!project?.githubUrl) {
    throw new Error('Project has no github URL');
  }

  return { project, githubUrl: project.githubUrl }
}

const filterUnprocessedCommits = async (projectId: string, commitHashes: Response[]) => {
  const processedCommits = await db.commit.findMany({
    where: { projectId: projectId }
  });
  const unprocessedCommits = commitHashes.filter((commit) => 
    !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash)
  );

  return unprocessedCommits;
}

const summarizeCommit = async (githubUrl: string, commitHash: string) => {
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: 'application/vnd.github.v3.diff'
    }
  });

  return await aiSummarizeCommit(data);
}