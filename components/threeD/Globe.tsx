"use client"; // Ensure it's a client component

import dynamic from "next/dynamic";

// Correct way to dynamically import Spline
const Spline = dynamic(() => import("@splinetool/react-spline").then((mod) => mod.default), {
  ssr: false, // Disable SSR for client-side rendering
});

export default function Globe() {
  return (
    <div className="w-full h-full">
      <Spline scene="https://prod.spline.design/Py9ONWLTKagJdofl/scene.splinecode" />
    </div>
  );
}
