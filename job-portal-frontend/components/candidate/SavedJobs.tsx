'use client';
import { useEffect, useState } from 'react';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  description?: string;
}

interface Props {
  reload?: boolean; // Parent can trigger reload
}

export default function SavedJobs({ reload }: Props) {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not logged in');

        const res = await fetch('http://localhost:5000/api/jobs/saved', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch saved jobs');

        const data: Job[] = await res.json();
        setSavedJobs(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [reload]); // reload dependency

  if (loading) return <p>Loading saved jobs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (savedJobs.length === 0) return <p>No saved jobs yet.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {savedJobs.map((job) => (
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
        </div>
      ))}
    </div>
  );
}
