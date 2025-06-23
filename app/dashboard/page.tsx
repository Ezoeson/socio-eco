import React, { Suspense } from 'react';
import Wrapper from '@/components/Wrapper';

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <Wrapper>
          <div className='flex h-screen items-center justify-center'>
            <div className='text-muted-foreground'>Loading...</div>
          </div>
        </Wrapper>
      }
    >
      <Wrapper>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
            <div className='bg-muted/50 aspect-video rounded-xl' />
            <div className='bg-muted/50 aspect-video rounded-xl' />
            <div className='bg-muted/50 aspect-video rounded-xl' />
          </div>
          <div className='bg-muted/50 aspect-video rounded-xl' />
          <div className='grid auto-rows-min gap-4 md:grid-cols-2'>
            <div className='bg-muted/50 aspect-video rounded-xl' />
            <div className='bg-muted/50 aspect-video rounded-xl' />
          </div>
        </div>
      </Wrapper>
    </Suspense>
  );
}
