'use client';
import { useEffect, useState } from 'react';
import RecruiterLayout from '@/components/RecruiterLayout';

interface Applicant {
  name: string;
  email: string;
}
interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  status: 'open' | 'closed';
  description: string;
  applicants: Applicant[];
}

export default function Dashboard() {
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

  return (
    <RecruiterLayout>
      <h1 className="text-3xl font-bold mb-6">All Jobs</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Salary</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Applicants</th>
              <th className="p-3 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{job.title}</td>
                <td className="p-3">{job.company}</td>
                <td className="p-3">{job.location}</td>
                <td className="p-3">₹{job.salary}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      job.status === 'open' ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  >
                    {job.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3">{job.applicants.length}</td>
                <td className="p-3 whitespace-pre-wrap break-words">
                  {job.description || 'No description available'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RecruiterLayout>
  );
}
