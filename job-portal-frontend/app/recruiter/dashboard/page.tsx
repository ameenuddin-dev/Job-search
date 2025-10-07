'use client';

import React, { useEffect, useState, useRef } from 'react';
import RecruiterLayout from '@/components/RecruiterLayout';
import { FaUsers, FaBriefcase, FaLock } from 'react-icons/fa';
import CountUp from 'react-countup';
import ReviewsBox from '@/components/ReviewBox';
import HiredShortlistedOverview from '@/components/HiredShortlistedOverview';

const recruiterData = {
  totalApplicants: 120,
  shortlisted: 25,
  hired: 10,
};

interface Applicant {
  name: string;
  email: string;
  review?: string;
  rating?: number;
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

const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch jobs
  useEffect(() => {
    if (!token) return;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/jobs/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data);
        setFilteredJobs(data); // initialize filtered list
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  // Filter jobs based on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  // Modal click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setSelectedJob(null);
      }
    };
    if (selectedJob) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedJob]);

  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex flex-col items-center justify-center h-80">
          <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-4 text-lg">Loading jobs...</p>
        </div>
      </RecruiterLayout>
    );
  }

  if (error) {
    return (
      <RecruiterLayout>
        <div className="text-center mt-10 text-red-500 text-lg">
          ⚠️ Error: {error}
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      {/* ===== Header ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Recruiter Dashboard
        </h1>
        <span className="text-sm text-gray-500 mt-2 md:mt-0">
          Updated on {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* ===== Search Bar ===== */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, company or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* ===== Main Layout: Summary + Reviews ===== */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        {/* ===== Left: Summary Cards ===== */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <div className="flex flex-col sm:flex-col gap-4">
            <div className="bg-blue-500 text-white rounded-2xl p-4 shadow-lg flex items-center gap-3 flex-1">
              <FaUsers className="text-3xl opacity-90" />
              <div>
                <h2 className="text-xs font-medium opacity-90">
                  Total Applications
                </h2>
                <p className="text-xl font-bold">
                  <CountUp
                    end={jobs.reduce(
                      (acc, job) => acc + job.applicants.length,
                      0
                    )}
                    duration={1.5}
                  />
                </p>
              </div>
            </div>

            <div className="bg-green-500 text-white rounded-2xl p-4 shadow-lg flex items-center gap-3 flex-1">
              <FaBriefcase className="text-3xl opacity-90" />
              <div>
                <h2 className="text-xs font-medium opacity-90">Open Jobs</h2>
                <p className="text-xl font-bold">
                  <CountUp
                    end={jobs.filter((j) => j.status === 'open').length}
                    duration={1.5}
                  />
                </p>
              </div>
            </div>

            <div className="bg-gray-700 text-white rounded-2xl p-4 shadow-lg flex items-center gap-3 flex-1">
              <FaLock className="text-3xl opacity-90" />
              <div>
                <h2 className="text-xs font-medium opacity-90">Closed Jobs</h2>
                <p className="text-xl font-bold">
                  <CountUp
                    end={jobs.filter((j) => j.status === 'closed').length}
                    duration={1.5}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* 🔹 Overview Section */}
        <HiredShortlistedOverview
          totalApplicants={recruiterData.totalApplicants}
          shortlisted={recruiterData.shortlisted}
          hired={recruiterData.hired}
        />
        {/* ===== Right: Reviews Summary ===== */}
        <div className="flex justify-center md:justify-end w-90 md:w-auto">
          <ReviewsBox jobs={jobs} />
        </div>
      </div>

      {/* ===== Jobs Table ===== */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-blue-100 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Salary</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Applicants</th>
              <th className="px-6 py-3 text-left">Latest Review</th>
              <th className="px-6 py-3 text-left">Details</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => {
                const latestReview = [...job.applicants]
                  .reverse()
                  .find((a) => a.review && a.review.trim() !== '');
                return (
                  <tr
                    key={job._id}
                    className={`transition-all duration-200 hover:bg-blue-50 ${
                      index % 2 === 0 ? '' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium">{job.title}</td>
                    <td className="px-6 py-4">{job.company}</td>
                    <td className="px-6 py-4">{job.location}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹{job.salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          job.status === 'open'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {job.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">{job.applicants.length}</td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {latestReview ? `"${latestReview.review}"` : 'No review'}
                    </td>
                    <td
                      className="px-6 py-4 text-blue-600 hover:underline cursor-pointer"
                      onClick={() => setSelectedJob(job)}
                    >
                      View
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Glass Modal ===== */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div
            ref={modalRef}
            className="relative bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl w-full max-w-3xl h-[80vh] overflow-hidden animate-slideUp"
          >
            <button
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setSelectedJob(null)}
            >
              ✖
            </button>

            <div className="p-6 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {selectedJob.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {selectedJob.company} • {selectedJob.location}
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6 shadow-inner">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-700 mb-6">
                <span>
                  <strong>Salary:</strong> ₹
                  {selectedJob.salary.toLocaleString()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedJob.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {selectedJob.status.toUpperCase()}
                </span>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-gray-800">
                  Applicants ({selectedJob.applicants.length})
                </h3>
                {selectedJob.applicants.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedJob.applicants.map((a, i) => (
                      <li
                        key={i}
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                      >
                        <p className="font-medium text-gray-900">{a.name}</p>
                        <p className="text-gray-500 text-sm">{a.email}</p>
                        {a.review && (
                          <p className="text-gray-700 text-sm mt-1">
                            "{a.review}"
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No applicants yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Animations ===== */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      <div className="text-center text-gray-500 text-xs mt-10 mb-10">
        © {new Date().getFullYear()} Recruiter Portal — All Rights Reserved
      </div>
    </RecruiterLayout>
  );
};

export default Dashboard;
