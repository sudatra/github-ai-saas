'use client'

import { Input } from '@/components/ui/input'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { FilterIcon, SearchIcon } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

const Search = (props: Props) => {
  const [searchText, setSearchText] = useState<string>('');
  const pathname = usePathname();
  const params = useParams();
  const { projectId } = useProject();
  const searchItems = api.project.searchItems.useMutation({
    onSuccess: (data) => { console.log("Search results: ", data) },
    onError: (error) => { console.log("error fetching search results") }
  });

  let searchSchema: string = '';

  if(pathname.includes('dashboard')) {
    searchSchema = 'commit';
  }
  else if(pathname.includes('qa')) {
    searchSchema = 'question';
  }
  else if(pathname === '/meetings') {
    searchSchema = 'meeting';
  }
  else if(pathname.startsWith('/meetings/')) {
    searchSchema = 'issue';
  }
  else if(pathname.includes('billing')) {
    searchSchema = 'transaction';
  }

  const getSearchResults = () => {
    const meetingId = searchSchema === 'issue' ? params.meetingId : undefined;
    searchItems.mutate({
      projectId,
      searchQuery: searchText,
      searchSchema,
      meetingId: meetingId as string
    })
  }

  return (
    <div className='flex gap-2'>
      <SearchIcon className='size-6 mt-1 mr-2' />
      <Input 
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        width={30}
        height={24}
        className='bg-white shadow-lg'
      />

      <FilterIcon 
        className='size-6 mt-1 ml-2 cursor-pointer' 
        onClick={() => getSearchResults()}
      />
    </div>
  )
}

export default Search