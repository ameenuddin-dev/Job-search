'use client';

import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import { useState, useEffect } from 'react';

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <Navbar />

      <header className="bg-gradient-to-r from-blue-500 to-purple-600 py-16 text-center rounded-b-3xl shadow-md">
        <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Explore Your Next Job
        </h1>
        <p className="text-lg text-white/90">
          Find your dream role with the best companies in India
        </p>
      </header>

      <main className="container mx-auto p-6 mt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Job Listings
          </h2>
          <input
            type="text"
            placeholder="Search jobs..."
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          />
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
