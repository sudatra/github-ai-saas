import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { indexGithubRepository } from "@/lib/github-loader";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure.input(
    z.object({
      name: z.string(),
      githubUrl: z.string(),
      githubToken: z.string().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const project = await ctx.db.project.create({
      data: {
        githubUrl: input.githubUrl,
        name: input.name,
        userToProjects: {
          create: {
            userId: ctx.user.userId!
          }
        }
      }
    });

    await pollCommits(project.id);
    await indexGithubRepository(project.id, input.githubUrl, input.githubToken);
    return project;
  }),

  getAllProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        userToProjects: {
          some: { userId: ctx.user.userId! }
        },
        deletedAt: null
      }
    })
  }),

  getAllProjectCommits: protectedProcedure.input(
    z.object({
      projectId: z.string()
    })
  ).query(async ({ ctx, input }) => {
    pollCommits(input.projectId)
    .then()
    .catch((error: unknown) => console.error(error))

    return await ctx.db.commit.findMany({
      where: { projectId: input.projectId }
    })
  }),

  saveAnswer: protectedProcedure.input(
    z.object({
      projectId: z.string(),
      question: z.string(),
      answer: z.string(),
      filesReference: z.any()
    })
  ).mutation(async ({ ctx, input }) => {
    return await ctx.db.question.create({
      data: {
        answer: input.answer,
        filesReferences: input.filesReference,
        projectId: input.projectId,
        question: input.question,
        userId: ctx.user.userId!
      }
    })
  }),

  getQuestions: protectedProcedure.input(
    z.object({
      projectId: z.string()
    })
  ).query(async ({ ctx, input }) => {
    return await ctx.db.question.findMany({
      where: { projectId: input.projectId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })
  })
})