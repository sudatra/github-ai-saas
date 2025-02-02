import { db } from '@/server/db';
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
    commitMessage: commit.commit.mesage ?? '',
    commitAuthorName: commit.commit?.author?.name ?? '',
    commitAuthorAvatar: commit?.author?.avatar_url ?? '',
    commitDate: commit.commit?.author?.date ?? ''
  }));
}

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
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

const summarizeCommits = async (githubUrl: string, commitHash: string) => {

}