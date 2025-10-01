'use client';

import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';

export default function Home() {
 
  const jobs = [
    {
      _id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Delhi',
      salary: 50000,
    },
    {
      _id: '2',
      title: 'Backend Developer',
      company: 'DevSolutions',
      location: 'Mumbai',
      salary: 60000,
    },
    {
      _id: '3',
      title: 'Fullstack Developer',
      company: 'InnovateX',
      location: 'Bangalore',
      salary: 70000,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
          Job Listings
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
