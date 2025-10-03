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
  const COLORS = ['#4CAF50', '#FF7043'];

  return (
    <RecruiterLayout>
      <h1 className="text-3xl font-bold mb-6">Job Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="mb-4 font-bold">Applicants per Job</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={jobsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applicants" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="mb-4 font-bold">Job Status Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} outerRadius={80} dataKey="value">
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </RecruiterLayout>
  );
}
