'use client';
import { useEffect, useState } from 'react';
import { Job } from '@/types';

interface Props {
  onApply: (job: Job) => void;
  onSave: (job: Job) => void;
  reload?: boolean;
}

export default function AvailableJobs({ onApply, onSave, reload }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/jobs', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data: Job[] = await res.json();
        setJobs(data.filter((job) => job.status === 'open'));
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [reload]);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (jobs.length === 0) return <p>No available jobs at the moment.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="border p-4 rounded-2xl shadow-md hover:shadow-lg transition duration-200 bg-white"
        >
          <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
          <p className="text-gray-600">{job.company}</p>
          <p className="text-gray-500">{job.location}</p>
          <p className="font-medium mt-1 text-gray-700">
            Salary: ₹{job.salary}
          </p>
          {job.description && (
            <p className="text-gray-700 mt-2 line-clamp-4">{job.description}</p>
          )}
          <div className="flex gap-2 mt-3">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={() => onApply(job)}
            >
              Apply
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
              onClick={() => onSave(job)}
            >
              Save
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
