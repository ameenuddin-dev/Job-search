'use client';
import { useEffect, useState } from 'react';
import RecruiterLayout from '@/components/RecruiterLayout';
import React from 'react';

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

export default function SearchJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [modalApplicants, setModalApplicants] = useState<Applicant[] | null>(
    null
  );
  const [expandedJobs, setExpandedJobs] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (job: Job) => {
    if (!token) return;
    try {
      await fetch(`http://localhost:5000/api/jobs/${job._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: job.status === 'open' ? 'closed' : 'open',
        }),
      });
      setJobs(
        jobs.map((j) =>
          j._id === job._id
            ? { ...j, status: j.status === 'open' ? 'closed' : 'open' }
            : j
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!token) return;
    try {
      await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  const saveEditJob = async () => {
    if (!token || !editJob) return;
    try {
      await fetch(`http://localhost:5000/api/jobs/${editJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editJob),
      });
      setJobs(jobs.map((j) => (j._id === editJob._id ? editJob : j)));
      setEditJob(null);
    } catch (err) {
      console.error(err);
    }
  };

  const viewApplicants = (job: Job) => {
    setModalApplicants(job.applicants);
    setOpenDropdown(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedJobs((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  return (
    <RecruiterLayout>
      <h1 className="text-3xl font-bold mb-6">Search Jobs</h1>

      <input
        type="text"
        placeholder="Search jobs by title, company, location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/4 p-3 mb-6 border rounded-xl shadow focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-xl">
          <thead className="bg-blue-500 text-white hidden md:table-header-group">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Salary</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Applicants</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <React.Fragment key={job._id}>
                {/* Desktop & Mobile Row */}
                <tr className="border-b hover:bg-gray-100 cursor-pointer md:h-auto">
                  {/* Desktop Columns */}
                  <td
                    className="px-4 py-3 hidden md:table-cell"
                    onClick={() => toggleExpand(job._id)}
                  >
                    {job.title} {expandedJobs.includes(job._id) ? '▲' : '▼'}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {job.company}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {job.location}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    ₹{job.salary}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        job.status === 'open' ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    >
                      {job.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {job.applicants?.length || 0}
                  </td>
                  <td className="px-4 py-3 relative hidden md:table-cell">
                    {/* Desktop Actions */}
                    <div className="relative inline-block w-full text-left">
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === job._id ? null : job._id
                          )
                        }
                        className="w-full py-2 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-between"
                      >
                        Actions
                        <span
                          className={`ml-2 transform transition-transform duration-200 ${
                            openDropdown === job._id ? 'rotate-180' : ''
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                      {openDropdown === job._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50 flex flex-col max-h-64 overflow-y-auto p-2">
                          <button
                            onClick={() => setEditJob(job)}
                            className="flex items-center px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => toggleStatus(job)}
                            className="flex items-center px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 transition"
                          >
                            {job.status === 'open' ? '🔒 Close' : '✅ Open'}
                          </button>
                          <button
                            onClick={() => deleteJob(job._id)}
                            className="flex items-center px-3 py-2 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                          >
                            🗑️ Delete
                          </button>
                          <button
                            onClick={() => viewApplicants(job)}
                            className="flex items-center px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 transition"
                          >
                            👥 Applicants
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Mobile compact row */}
                  <td className="px-4 py-3 md:hidden">
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold">{job.title}</span>
                      <span className="text-gray-500 text-sm">
                        {job.company}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {job.location}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ₹{job.salary}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-white text-xs ${
                          job.status === 'open' ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      >
                        {job.status.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Applicants: {job.applicants?.length || 0}
                      </span>
                      <div className="flex space-x-2 mt-1 overflow-x-auto">
                        <button
                          onClick={() => setEditJob(job)}
                          className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => toggleStatus(job)}
                          className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                        >
                          {job.status === 'open' ? '🔒' : '✅'}
                        </button>
                        <button
                          onClick={() => deleteJob(job._id)}
                          className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => viewApplicants(job)}
                          className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                        >
                          👥
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>

                {expandedJobs.includes(job._id) && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-3 bg-gray-50 text-gray-700 whitespace-pre-wrap break-words text-sm md:text-base"
                    >
                      {job.description || 'No description available'}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Applicants Modal */}
      {modalApplicants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg flex flex-col max-h-[80vh]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              Applicants
            </h2>
            <div className="overflow-y-auto flex-1 space-y-3">
              {modalApplicants.length > 0 ? (
                modalApplicants.map((app, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-xl shadow hover:shadow-md transition"
                  >
                    <p className="font-semibold text-gray-700">{app.name}</p>
                    <p className="text-gray-500 text-sm">{app.email}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No applicants yet</p>
              )}
            </div>
            <button
              onClick={() => setModalApplicants(null)}
              className="mt-4 w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Edit Job Modal */}
      {editJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              Edit Job
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                value={editJob.title}
                onChange={(e) =>
                  setEditJob({ ...editJob, title: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                placeholder="Job Title"
              />
              <input
                type="text"
                value={editJob.company}
                onChange={(e) =>
                  setEditJob({ ...editJob, company: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                placeholder="Company"
              />
              <input
                type="text"
                value={editJob.location}
                onChange={(e) =>
                  setEditJob({ ...editJob, location: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                placeholder="Location"
              />
              <input
                type="number"
                value={editJob.salary}
                onChange={(e) =>
                  setEditJob({ ...editJob, salary: Number(e.target.value) })
                }
                className="w-full p-3 border rounded-xl"
                placeholder="Salary"
              />
              <textarea
                value={editJob.description}
                onChange={(e) =>
                  setEditJob({ ...editJob, description: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                placeholder="Job Description"
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setEditJob(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveEditJob}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </RecruiterLayout>
  );
}
