"use client"
import { lazy, Suspense } from 'react';

// Lazy load the Comments component
const CommentsComponent = lazy(() => import('./Comments'));

// Loading skeleton for Comments component
const CommentsLoading = () => (
  <div className="container max-w-[2000px] m-auto">
    {/* Post skeleton */}
    <div className='relative mb-8 md:mb-12'>
      <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl animate-pulse'>
        <div className='bg-transparent rounded-2xl break-all text-base md:text-xl flex'>
          <div className='w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl mr-4 md:mr-6 animate-pulse' />
          <div className='flex-1'>
            <div className='font-bold bg-white/10 w-48 h-6 md:h-7 rounded-lg mb-4 animate-pulse' />
            <div className='bg-white/10 w-full h-24 md:h-32 rounded-2xl mb-6 animate-pulse' />
            <div className='flex justify-end'>
              <div className='bg-white/10 w-32 h-12 rounded-2xl animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Comments list skeleton */}
    {[...Array(3)].map((_, index) => (
      <div className='mt-5 md:mt-10' key={index}>
        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl animate-pulse flex'>
          <div className='w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl mr-4 md:mr-6 animate-pulse' />
          <div className='flex-1'>
            <div className='font-bold bg-white/10 w-32 h-6 md:h-7 rounded-lg mb-3 animate-pulse' />
            <div className='space-y-3'>
              <div className='bg-white/10 w-full h-5 rounded-lg animate-pulse' />
              <div className='bg-white/10 w-3/4 h-5 rounded-lg animate-pulse' />
              <div className='bg-white/10 w-1/2 h-5 rounded-lg animate-pulse' />
            </div>
            <div className='mt-6 flex items-center gap-3'>
              <div className='w-5 h-5 bg-white/10 rounded animate-pulse' />
              <div className='bg-white/10 w-32 h-4 rounded-lg animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface CommentsParams {
  lang: string;
  message_id: string;
  message_page?: number;
  singlePageMode?: boolean;
  baseURL?: string;
}

export default function Comments(params: CommentsParams) {
  return (
    <Suspense fallback={<CommentsLoading />}>
      <CommentsComponent {...params} />
    </Suspense>
  );
}