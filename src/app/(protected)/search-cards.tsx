'use client'

import useProject from '@/hooks/use-project'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const CommitSearchCard = ({ commit }: { commit: any }) => {
  const { project, projectId } = useProject();

  return (
    <li
      key={commit.id}
      className='relative flex gap-x-4'
    >
      <div
        className='absolute left-0 top-0 flex w-6 justify-center'
      >
        <div className='w-px translate-x-1 bg-gray-200' />
      </div>

      <>
        <Image 
          src={commit.commitAuthorAvatar}
          alt='commit avatar'
          className='relative justify-center items-center mt-3 flex-none size-8 rounded-full bg-gray-50'
          height={32}
          width={32}
        />

        <div className='flex-auto rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200'>
          <div className='flex justify-between gap-x-4'>
            <Link
              target='_blank'
              href={`${project?.githubUrl}/commits/${commit.commitHash}`}
              className='py-0.5 text-xs leading-5 text-gray-500 flex'
            >
              <span className='font-medium text-gray-900'>{commit.commitAuthorName}{" "}</span>{" "}
              <span className='inline-flex items-center'>commited</span>
              <ExternalLink className='ml-1 size-4' />
            </Link>
          </div>
          
          <span className='font-semibold'>{commit.commitMessage !== '' ? commit.commitMessage : "# Commit message"}</span>
          <pre className='mt-2 text-sm whitespace-pre-wrap leading-6 text-gray-500'>{commit.summary}</pre>
        </div>

      </>
    </li>
  )
}
