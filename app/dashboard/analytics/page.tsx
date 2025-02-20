'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const data = {
  monthly: [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ],
  pieData: [
    { name: 'Completed', value: 400 },
    { name: 'In Progress', value: 300 },
    { name: 'Pending', value: 200 },
    { name: 'Cancelled', value: 100 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsPage() {
  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Customer Satisfaction', value: '94%', change: '+2.5%' },
            { label: 'On-time Completion', value: '87%', change: '+1.2%' },
            { label: 'Repeat Customers', value: '62%', change: '+4.8%' }
          ].map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-gray-500 text-sm font-medium">{metric.label}</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold">{metric.value}</p>
                <span className="ml-2 text-sm font-medium text-green-600">{metric.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <AreaChart width={500} height={300} data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </div>

          {/* Service Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Service Distribution</h3>
            <PieChart width={500} height={300}>
              <Pie
                data={data.pieData}
                cx={250}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
// GREAT
