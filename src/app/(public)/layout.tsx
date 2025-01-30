import React from 'react'

type Props = {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: Props) => {
  return (
    <div className='flex flex-1 min-h-screen justify-center items-center'>
      {children}
    </div>
  )
}

export default PublicLayout