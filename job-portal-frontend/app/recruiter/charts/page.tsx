'use client';
import { useEffect, useState } from 'react';
import RecruiterLayout from '@/components/RecruiterLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine,
  Line,
} from 'recharts';

interface Applicant {
  name: string;
  email: string;
}
interface Job {
  _id: string;
  title: string;
  applicants: Applicant[];
  status: 'open' | 'closed';
}

// 🔹 Helper function for moving average
const calculateMovingAverage = (data: any[], windowSize: number) => {
  return data.map((_, index) => {
    const start = Math.max(0, index - windowSize + 1);
    const subset = data.slice(start, index + 1);
    const avg =
      subset.reduce((sum, d) => sum + d.applicants, 0) / subset.length;
    return { ...data[index], movingAvg: avg };
  });
};

export default function ChartsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;
    const fetchJobs = async () => {
      const res = await fetch('http://localhost:5000/api/jobs/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJobs(data);
    };
    fetchJobs();
  }, [token]);

  const jobsData = jobs.map((job) => ({
    name: job.title,
    applicants: job.applicants.length,
  }));

  // 🔹 Calculate moving average with window size 3
  const jobsWithTrend = calculateMovingAverage(jobsData, 3);

  const avgApplicants =
    jobsData.length > 0
      ? jobsData.reduce((sum, job) => sum + job.applicants, 0) / jobsData.length
      : 0;

  const statusData = [
    {
      name: 'Open Jobs',
      value: jobs.filter((j) => j.status === 'open').length,
    },
    {
      name: 'Closed Jobs',
      value: jobs.filter((j) => j.status === 'closed').length,
    },
  ];

  const COLORS = ['#4CAF50', '#FF7043', '#2196F3', '#9C27B0'];

  return (
    <RecruiterLayout>
      <h1 className="text-3xl font-bold mb-6">Job Insights</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs data available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart with Trendline + Moving Average + Avg Line */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="mb-4 font-semibold text-lg text-gray-800">
              Applicants per Job
            </h2>
            <ResponsiveContainer width="100%" minHeight={350}>
              <BarChart data={jobsWithTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                  }}
                />

                {/* Bars */}
                <Bar dataKey="applicants" radius={[8, 8, 0, 0]}>
                  {jobsData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>

                {/* Raw Trendline */}
                <Line
                  type="monotone"
                  dataKey="applicants"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#2563EB' }}
                  activeDot={{ r: 5 }}
                  name="Applicants Trend"
                />

                {/* Moving Average Trendline */}
                <Line
                  type="monotone"
                  dataKey="movingAvg"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  name="Moving Avg (3)"
                />

                {/* Average Line */}
                <ReferenceLine
                  y={avgApplicants}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  label={{
                    value: `Avg: ${avgApplicants.toFixed(1)}`,
                    position: 'top',
                    fill: '#EF4444',
                    fontSize: 12,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="mb-4 font-semibold text-lg text-gray-800">
              Job Status Overview
            </h2>
            <ResponsiveContainer width="100%" minHeight={350}>
              <PieChart>
                <Pie
                  data={statusData}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip
                  formatter={(value: number) => `${value} jobs`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </RecruiterLayout>
  );
}
