// app/dashboard/schedule/page.tsx
"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Schedule from "@/components/Schedule";

export default function SchedulePage() {
  const [workerId, setWorkerId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wid = localStorage.getItem('WorkerID');
      setWorkerId(wid);
    }
  }, []);

  if (!workerId) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout title="Schedule">
      <Schedule workerId={workerId} />
    </DashboardLayout>
  );
}