import { SidebarProvider } from '@/components/ui/sidebar';
import { UserButton } from '@clerk/nextjs';
import React from 'react'
import { AppSidebar } from './app-sidebar';
import Search from './search';

type Props = {
  children: React.ReactNode;
}

const Sidebarlayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className='w-full m-2'>
        <div className='flex items-center gap-2 bg-blue-50 border shadow rounded-md p-2 px-4'>
          <div className='ml-8 right-4'>
            <Search />
          </div>

          <div className='ml-auto' />
          <UserButton />
        </div>

        <div className='h-4 mt-4'>
          <div className='bg-blue-50 border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4'>
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}

export default Sidebarlayout
