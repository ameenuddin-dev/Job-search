'use client';

import { useEffect, useState } from 'react';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  description?: string;
  applicants?: { _id: string; name: string; status: string }[];
}

export default function MyApplications() {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch('http://localhost:5000/api/jobs/applied', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error('Failed to fetch applied jobs');
        const data: Job[] = await res.json();
        setAppliedJobs(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);

  if (loading) return <p>Loading applied jobs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (appliedJobs.length === 0)
    return <p>You have not applied to any jobs yet.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {appliedJobs.map((job) => (
        <div
          key={job._id}
          className="border p-4 rounded shadow hover:shadow-lg transition duration-200"
        >
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p className="text-gray-600">{job.company}</p>
          <p className="text-gray-500">{job.location}</p>
          <p className="font-medium mt-1">Salary: ₹{job.salary}</p>
          {job.description && (
            <p className="text-gray-700 mt-2 line-clamp-4">{job.description}</p>
          )}
          <span className="inline-block mt-3 px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">
            Applied
          </span>
        </div>
      ))}
    </div>
  );
}
