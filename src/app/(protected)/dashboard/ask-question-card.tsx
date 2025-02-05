'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useProject from '@/hooks/use-project'
import { CircleAlert } from 'lucide-react';
import React, { FormEvent, useState } from 'react'
import { askQuestion } from './actions';
import { readStreamableValue } from 'ai/rsc';

interface FilesReference {
  fileName: string;
  sourceCode: string;
  summary: string;
}

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [filesReferences, setFilesReferences] = useState<FilesReference[]>([]);
  const [answer, setAnswer] = useState<string>('');

  const onQuestionSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!project?.id) {  
      return;
    }

    setLoading(true);
    setOpen(true);

    const { output, fileReferences } = await askQuestion(question, project.id);
    setFilesReferences(fileReferences);

    for await (const delta of readStreamableValue(output)) {
      if(delta) {
        setAnswer((ans: any) => ans + delta);
      }
    }

    setLoading(false);
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <CircleAlert 
                width={40}
                height={40}
              />
            </DialogTitle>
          </DialogHeader>

          {answer}

          <h1>File References</h1>
          {
            filesReferences.map((file) => (
              <span>{file.fileName}</span>
            ))
          }
        </DialogContent>
      </Dialog>

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
