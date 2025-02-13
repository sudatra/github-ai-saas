'use client'

import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

const Search = (props: Props) => {
  const [searchText, setSearchText] = useState<string>('');
  const pathname = usePathname();

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
    </div>
  )
}

export default Search