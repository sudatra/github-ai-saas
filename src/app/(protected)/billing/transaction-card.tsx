import React from 'react'
import { TransactionProps } from './page'
import Image from 'next/image';

type Props = {
  transaction: TransactionProps;
}

const TransactionCard = ({ transaction }: Props) => {
  return (
    <div className='flex items-center p-4 gap-4 bg-white rounded-lg shadow-border'>
      <Image 
        src={transaction.user.imageUrl ?? ''}
        alt='user-avatar'
        className='rounded-full'
        height={30}
        width={30}
      />

      <div className='text-left flex flex-col'>
        <div className='flex items-center gap-2'>
          <p className='text-gray-700 line-clamp-1 text-lg font-medium capitalize'>{transaction.credits}</p>
          <span className='text-xs text-gray-400 whitespace-nowrap'>{transaction.createdAt.toLocaleDateString()}</span>
        </div>

        <p className='text-gray-500 line-clamp-1 text-sm'>Current Credits - <strong>{transaction.user.credits}</strong></p>
      </div>
    </div>
  ) 
}

export default TransactionCard