'use client'

import { Sheet } from '@/components/ui/sheet';
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react';
import React from 'react'

const QAPage = () => {
  const { projectId } = useProject();
  const { data: questions } = api.project.getQuestions.useQuery({ projectId })

  return (
    <Sheet>
      
    </Sheet>
  )
}

export default QAPage
