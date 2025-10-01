'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function PostJob() {
  const router = useRouter();
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
  });

  const handleChange = (e: any) =>
    setJob({ ...job, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first!');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Job Posted! Title: ${data.job.title}`);
        setJob({
          title: '',
          company: '',
          location: '',
          salary: '',
          description: '',
        });
      } else {
        alert(data.error || 'Failed to post job');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-4">
        <form
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg space-y-6"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-6">
            Post a Job
          </h2>

          {['title', 'company', 'location'].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={job[field as keyof typeof job]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          ))}

          <input
            type="number"
            name="salary"
            value={job.salary}
            onChange={handleChange}
            placeholder="Salary"
            className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            placeholder="Job Description"
            rows={4}
            className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-green-500 transition-all duration-300"
          >
            Post Job
          </button>
        </form>
      </div>
    </>
  );
}
