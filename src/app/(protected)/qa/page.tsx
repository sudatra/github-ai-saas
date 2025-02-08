'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react';
import React, { useState } from 'react'
import AskQuestionCard from '../dashboard/ask-question-card';
import Image from 'next/image';
import MDEditor from '@uiw/react-md-editor';
import CodeReferences from '../dashboard/code-references';

const QAPage = () => {
  const { projectId } = useProject();
  const { data: questions } = api.project.getQuestions.useQuery({ projectId });
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const question = questions?.[questionIndex];

  return (
    <Sheet>
      <AskQuestionCard />
      <div className='h-4' />
      <h1 className='text-xl font-semibold'>Saved Questions</h1>
      <div className="h2" />

      <div className='flex flex-col gap-2'>
        {
          questions?.map((question, index) => (
            <>
              <SheetTrigger onClick={() => setQuestionIndex(index)}>
                <div className='flex items-center p-4 gap-4 bg-white rounded-lg shadow border'>
                  <Image 
                    src={question.user.imageUrl ?? ''}
                    alt='user-avatar'
                    className='rounded-full'
                    height={30}
                    width={30}
                  />

                  <div className='text-left flex flex-col'>
                    <div className='flex items-center gap-2'>
                      <p className='text-gray-700 line-clamp-1 text-lg font-medium'>{question.question}</p>
                      <span className='text-xs text-gray-400 whitespace-nowrap'>{question.createdAt.toLocaleDateString()}</span>
                    </div>

                    <p className='text-gray-500 line-clamp-1 text-sm'>{question.answer}</p>
                  </div>
                </div>
              </SheetTrigger>
            </>
          ))
        }
      </div>

      {
        question && (
          <SheetContent className='sm:max-w-[80vw] overflow-scroll'>
            <SheetHeader>
              <SheetTitle>{question.question}</SheetTitle>
              <MDEditor.Markdown source={question.answer} />
              <CodeReferences filesReferences={(question.filesReferences ?? []) as any} />
            </SheetHeader>
          </SheetContent>
        )
      }
    </Sheet>
  )
}

export default QAPage
