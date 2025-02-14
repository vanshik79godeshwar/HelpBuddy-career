'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Zap, 
  Package, 
  Star, 
  Award, 
  Clock, 
  TrendingUp,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const overviewStats = [
  { title: 'Today\'s Earnings', value: '$342', trend: '+12%', icon: Zap, trending: 'up' },
  { title: 'Active Services', value: '24', trend: '+5%', icon: Package, trending: 'up' },
  { title: 'Customer Rating', value: '4.8/5', trend: '+0.2', icon: Star, trending: 'up' },
  { title: 'Completion Rate', value: '96%', trend: '+3%', icon: Award, trending: 'up' },
  { title: 'Response Time', value: '28m', trend: '-15%', icon: Clock, trending: 'down' },
  { title: 'Total Reviews', value: '1.2k', trend: '+8%', icon: TrendingUp, trending: 'up' }
];

export default function DashboardPage() {
  return (
    <DashboardLayout title="Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <stat.icon className="w-6 h-6 text-gray-700" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium
                ${stat.trending === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trending === 'up' ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { user: 'Sarah Thompson', action: 'Created a new project', time: '2 hours ago' },
              { user: 'Michael Chen', action: 'Completed task review', time: '4 hours ago' },
              { user: 'Emily Rodriguez', action: 'Updated documentation', time: '6 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <img
                  src={`https://images.unsplash.com/photo-${1500000000000 + index}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                  alt={activity.user}
                  className="h-10 w-10 rounded-full"
                />
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Package, label: 'Add Service' },
              { icon: Star, label: 'Reviews' },
              { icon: Clock, label: 'Schedule' },
              { icon: TrendingUp, label: 'Analytics' },
            ].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <action.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}