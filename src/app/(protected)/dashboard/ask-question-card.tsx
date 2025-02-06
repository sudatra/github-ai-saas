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
import MDEditor from '@uiw/react-md-editor';
import CodeReferences from './code-references';
import { api } from '@/trpc/react';
import { toast } from 'sonner';

export interface FilesReference {
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
  const saveAnswer = api.project.saveAnswer.useMutation();

  const onQuestionSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setAnswer('');
    setFilesReferences([]);
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
        <DialogContent className='sm:max-w-[80vw]'>
          <DialogHeader>
            <div className='flex items-center gap-2'>
              <DialogTitle>
                <CircleAlert 
                  width={40}
                  height={40}
                />
              </DialogTitle>

              <Button
                variant='outline'
                disabled={saveAnswer.isPending}
                onClick={() => saveAnswer.mutate({
                  projectId: project!.id,
                  question,
                  answer,
                  filesReference: filesReferences
                }, {
                  onSuccess: () => { toast.success('Answer Saved') },
                  onError: () => { toast.error('Error Saving Answer!') }
                })}
              >
                Save Answer
              </Button>
            </div>
          </DialogHeader>

          <MDEditor.Markdown 
            source={answer}
            className='max-w-[70vw] !h-full max-h-[40vh] overflow-scroll'
          />

          <div className='h-4' />
          <CodeReferences filesReferences={filesReferences} />

          <Button
            type='button'
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
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
                disabled={loading}
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
