// components/Dashboard/DashboardHeader.tsx
import { WorkerInfo } from '@/context/AuthContext';

interface DashboardHeaderProps {
  worker: WorkerInfo | null;
}

export default function DashboardHeader({ worker }: DashboardHeaderProps) {
  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      <p className="text-gray-600">Welcome, {worker?.fullName || 'Guest'}!</p>
      {worker?.isApproved ? (
        <p className="text-green-500">Your account has been approved!</p>
      ) : (
        <p className="text-red-500">Your account is pending admin approval.</p>
      )}
    </div>
  );
}