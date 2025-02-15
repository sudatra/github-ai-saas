'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useProject from '@/hooks/use-project'
import { Badge, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const CommitSearchCard = ({ commit }: { commit: any }) => {
  const { project } = useProject();

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

export const QuestionSearchCard = ({ question }: { question: any }) => {
  return (
    <li 
      key={question.id}
      className='flex items-center justify-between py-5 gap-x-6'
    >
      <div 
        key={question.id}
        className='flex items-center p-4 gap-4 bg-white rounded-lg shadow border overflow-scroll'
      >
        <Image 
          src={question.user.imageUrl ?? ''}
          alt='user-avatar'
          className='rounded-full'
          height={30}
          width={30}
        />

        <div className='text-left flex flex-col'>
          <div className='flex items-center gap-2'>
            <p className='text-gray-700 line-clamp-2 text-lg font-medium capitalize'>{question.question}</p>
            <span className='text-xs text-gray-400 whitespace-nowrap'>{question.createdAt.toLocaleDateString()}</span>
          </div>

          <p className='text-gray-500 line-clamp-2 text-sm'>{question.answer}</p>
        </div>
      </div>
    </li>
  )
}

export const MeetingSearchCard = ({ meeting }: { meeting: any }) => {
  return (
    <li
      key={meeting.id}
      className='flex items-center justify-between py-5 gap-x-6'
    >
      <div>
        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <Link 
              href={`/meetings/${meeting.id}`}
              className='text-sm font-semibold'
            >
              {meeting.name}
            </Link>

            {
              meeting.status === 'PROCESSING' && (
                <Badge className='bg-yellow-500 text-white'>Processing...</Badge>
              )
            }
          </div>
        </div>

        <div className='flex items-center text-xs text-gray-500 gap-x-2'>
          <p className='whitespace-nowrap'>{meeting.createdAt.toLocaleDateString()}</p>
          <p className='truncate'>{meeting.issues.length} issues</p>
        </div>
      </div>
    </li>
  )
}

export const IssueSearchCard = ({ issue }: { issue: any }) => {
  return (
    <li
      key={issue.id}
      className='flex items-center justify-between py-5 gap-x-6'
    >
      <Card className='relative'>
        <CardContent>
          <CardHeader>
            <CardTitle className='text-xl'>{issue.gist}</CardTitle>
            <div className='border-b' />
            <CardDescription>{issue.createdAt.toLocaleDateString()}</CardDescription>
            <p>{issue.headline}</p>
            <blockquote className='mt-2 border-l-4 border-gray-300 bg-gray-50 p-4'>
              <span className='text-sm text-gray-600'>{issue.start} - {issue.end}</span>
              <p className='font-medium italic leading-relaxed text-gray-900'>{issue.summary}</p>
            </blockquote>
          </CardHeader>
        </CardContent>
      </Card>
    </li>
  )
}

export const TransactionSearchCard = ({ transaction }: { transaction: any }) => {
  return (
    <li
      key={transaction.id}
      className='flex items-center justify-between py-5 gap-x-6'
    >
      <div className='flex items-center p-4 gap-4 bg-slate-100 rounded-lg shadow-border'>
          <Image 
            src={transaction.user.imageUrl ?? ''}
            alt='user-avatar'
            className='rounded-full'
            height={30}
            width={30}
          />
    
          <div className='text-left flex flex-col'>
            <div className='flex items-center gap-2'>
              <p className='text-gray-700 line-clamp-1 text-lg font-medium capitalize'>{transaction.credits}</p>
              <span className='text-xs text-gray-400 whitespace-nowrap'>{transaction.createdAt.toLocaleDateString()}</span>
            </div>
    
            <p className='text-gray-500 line-clamp-1 text-sm'>Current Credits - <strong>{transaction.user.credits}</strong></p>
          </div>
        </div>
    </li>
  )
}
