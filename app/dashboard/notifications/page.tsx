"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Notification from "@/components/Notifications";

export default function NotificationsPage() {
    const wid: string = localStorage.getItem('WorkerID') || '';
    return (
        <DashboardLayout title="Notifications">
        <Notification workerId={wid} />
        </DashboardLayout>
    );
}