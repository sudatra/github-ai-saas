'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import useProject from '@/hooks/use-project'
import React, { FormEvent, useState } from 'react'

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState<string>('');

  const onQuestionSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(question)
  }

  return (
    <>
      <Card className='relative col-span-3'>
        <CardHeader>
          <CardTitle>Ask a question !!!</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onQuestionSubmit}>
            <Textarea 
              placeholder='Ask something about your project...'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <div className='h-4' />
            <div className='flex justify-end'>
              <Button 
                type='submit'
                className='w-24 text-sm font-semibold'
              >
                Ask
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default AskQuestionCard
