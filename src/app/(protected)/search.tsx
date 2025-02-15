'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { Filter, FilterX, SearchIcon } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { CommitSearchCard, IssueSearchCard, MeetingSearchCard, QuestionSearchCard, TransactionSearchCard } from './search-cards'

type Props = {}

const Search = (props: Props) => {
  const [searchText, setSearchText] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const params = useParams();
  const { projectId } = useProject();
  const searchResults = api.project.searchItems.useMutation({
    onSuccess: () => { setModalOpen(true) },
    onError: () => { toast.error("Unable to fetch search results") }
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
    searchResults.mutate({
      projectId,
      searchQuery: searchText,
      searchSchema,
      meetingId: meetingId as string
    })
  }

  return (
    <>
      <Dialog
        open={modalOpen}
        onOpenChange={setModalOpen}
      >
        <DialogContent className='overflow-scroll h-[75vh] w-auto'>
          <DialogHeader>
            <DialogTitle>
              <p className='flex justify-center items-center text-lg'>Search Results</p>
            </DialogTitle>

            <DialogDescription>The Results for <strong>{searchText}</strong> are: </DialogDescription>
          </DialogHeader>

          {
            pathname === '/dashboard' ? (
              <ul className='h-[80vh] space-y-2 overflow-y-scroll overflow-x-scroll'>
                {
                  searchResults.data?.map((searchResult) => (
                    <CommitSearchCard 
                      commit={searchResult} 
                      key={searchResult.id}
                    />
                  ))
                }
              </ul>
            ) : pathname === '/qa' ? (
              <ul>
                {
                  searchResults.data?.map((searchResult) => (
                    <QuestionSearchCard 
                      question={searchResult}
                      key={searchResult.id}
                    />
                  ))
                }
              </ul>
            ) : pathname === '/meetings' ? (
              <ul>
                {
                  searchResults.data?.map((searchResult) => (
                    <MeetingSearchCard 
                      meeting={searchResult}
                      key={searchResult.id}
                    />
                  ))
                }
              </ul>
            ) : pathname.startsWith('/meetings/') ? (
              <ul>
                {
                  searchResults.data?.map((searchResult) => (
                    <IssueSearchCard 
                      issue={searchResult}
                      key={searchResult.id}
                    />
                  ))
                }
              </ul>
            ) : (
              <ul>
                {
                  searchResults.data?.map((searchResult) => (
                    <TransactionSearchCard 
                      transaction={searchResult}
                      key={searchResult.id}
                    />
                  ))
                }
              </ul>
            )
          }
          
        </DialogContent>
      </Dialog>

      <div className='flex gap-2'>
        <SearchIcon className='size-6 mt-1 mr-2' />
        <Input 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          width={30}
          height={24}
          className='bg-white shadow-lg'
        />

        <Filter 
          className='size-6 mt-1 ml-2 cursor-pointer' 
          onClick={() => getSearchResults()}
        />

        <FilterX 
          className='size-6 mt-1 ml-1 cursor-pointer'
          onClick={() => setSearchText('')}
        />
      </div>
    </>
  )
}

export default Search