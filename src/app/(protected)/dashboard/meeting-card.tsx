'use client'

import { Card } from '@/components/ui/card';
import { useDropzone } from 'react-dropzone';
import React, { useState } from 'react'
import { uploadFile } from '@/lib/firebase';
import { Presentation, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const MeetingCard = () => {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'audio/*': ['.mp3', '.mp4', '.wav', '.m4a']
    },
    multiple: false,
    maxSize: 50_000_000,
    onDrop: async (acceptedFiles) => {
      setIsUploading(true);

      const file = acceptedFiles[0];
      const downloadUrl = await uploadFile(file as File, setProgress);
      alert(downloadUrl)

      setIsUploading(false);
    } 
  });

  return (
    <Card 
      className='col-span-2 flex flex-col items-center justify-center p-10'
      {...getRootProps()}
    >
      {
        !isUploading ? (
          <>
            <Presentation className='size-10 animate-bounce' />
            <h3 className='mt-2 text-sm font-semibold text-gray-900'>Create a new meeting</h3>
            <p className='mt-1 text-center text-sm text-gray-500'>
              Analyse Your meeting
              <br />
              Powered by AI
            </p>

            <div className='mt-6'>
              <Button disabled={isUploading}>
                <Upload 
                  className='-ml-0.5 mr-1.5 size-5'
                  aria-hidden="true"
                />
                Upload Meeting

                <input 
                  className='hidden'
                  {...getInputProps()}
                />
              </Button>
            </div>
          </>
        ) : (
          <div>
            <CircularProgressbar 
              value={progress}
              text={`${progress} %`}
              className='size-20'
            />

            <p className='text-sm text-center text-gray-500'>Uploading your meeting...</p>
          </div>
        )
      }
    </Card>
  )
}

export default MeetingCard
