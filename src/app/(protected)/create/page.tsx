'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CircleGauge } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
}

const Create = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();

  const onSubmit = (data: FormInput) => {
    console.log(data);
    return true;
  }

  return (
    <div className='flex items-center gap-12 h-full justify-center'>
      <CircleGauge className='h-56 w-auto'/>
      <div>
        <div>
          <h1 className='font-semibold text-2xl'>Link Your Github Repository</h1>
          <p className='text-sm text-muted-foreground'>
            Enter the URL of your repository to link to Github-SaaS
          </p>
        </div>

        <div className='h-2 mt-2'/>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input 
              required
              { ...register('projectName', { required: true }) }
              placeholder='Project Name'
            />

            <div className='h-2 mt-2'/>
            <Input 
              required
              { ...register('repoUrl', { required: true }) }
              placeholder='Github URL'
              type='url'
            />

            <div className='h-2 mt-2'/>
            <Input 
              required
              { ...register('githubToken') }
              placeholder='Github Token'
            />

            <div className='h-4'/>
            <div className='flex justify-end'>
              <Button type='submit'>
                Create Project
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Create
