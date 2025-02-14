'use client';  // Make sure this is a Client Component
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,  // Disable server-side rendering
});

export default function Globe() {
  return (
    <main className='w-full h-full'>
      <Spline scene="https://prod.spline.design/Py9ONWLTKagJdofl/scene.splinecode" />
    </main>
  );
}
