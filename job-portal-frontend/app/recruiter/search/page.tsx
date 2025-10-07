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
      <h1 className="text-3xl font-bold mb-6">Edit Jobs</h1>

      <input
        type="text"
        placeholder="Search jobs by title, company, location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/4 p-3 mb-6 border rounded-xl shadow focus:ring-2 focus:ring-blue-400 outline-none"
      />
      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="w-full border-collapse text-sm md:text-base">
          {/* Sticky Header */}
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Title</th>
              <th className="px-6 py-4 text-left font-semibold">Company</th>
              <th className="px-6 py-4 text-left font-semibold">Location</th>
              <th className="px-6 py-4 text-left font-semibold">Salary</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Applicants</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredJobs.map((job) => (
              <React.Fragment key={job._id}>
                <tr className="bg-white hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                  <td
                    className="px-6 py-4 font-medium text-gray-800"
                    onClick={() => toggleExpand(job._id)}
                  >
                    {job.title}{' '}
                    <span className="ml-1 text-gray-400">
                      {expandedJobs.includes(job._id) ? '▲' : '▼'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{job.company}</td>
                  <td className="px-6 py-4 text-gray-700">{job.location}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    ₹{job.salary}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full shadow ${
                        job.status === 'open'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {job.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {job.applicants?.length || 0}
                  </td>
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === job._id ? null : job._id
                        )
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium shadow hover:bg-blue-600 transition flex items-center"
                    >
                      Actions
                      <span
                        className={`ml-2 transform transition-transform ${
                          openDropdown === job._id ? 'rotate-180' : ''
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {/* Dropdown */}
                    {openDropdown === job._id && (
                      <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-xl z-50 overflow-hidden">
                        <button
                          onClick={() => setEditJob(job)}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(job)}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition"
                        >
                          {job.status === 'open' ? '🔒 Close' : '✅ Open'}
                        </button>
                        <button
                          onClick={() => deleteJob(job._id)}
                          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 transition"
                        >
                          🗑️ Delete
                        </button>
                        <button
                          onClick={() => viewApplicants(job)}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition"
                        >
                          👥 Applicants
                        </button>
                      </div>
                    )}
                  </td>
                </tr>

                {/* Expanded Description */}
                {expandedJobs.includes(job._id) && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 bg-gray-50 text-gray-600 text-sm rounded-b-xl"
                    >
                      {job.description || 'No description available'}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow-md p-4 space-y-2 border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    job.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {job.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{job.company}</p>
              <p className="text-gray-500 text-sm">{job.location}</p>
              <p className="text-green-600 font-semibold">₹{job.salary}</p>
              <p className="text-gray-500 text-sm">
                Applicants: {job.applicants?.length || 0}
              </p>

              {expandedJobs.includes(job._id) && (
                <p className="text-gray-600 text-sm mt-2">
                  {job.description || 'No description available'}
                </p>
              )}

              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => toggleExpand(job._id)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  {expandedJobs.includes(job._id)
                    ? 'Hide details ▲'
                    : 'Show details ▼'}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditJob(job)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => toggleStatus(job)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    {job.status === 'open' ? '🔒' : '✅'}
                  </button>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => viewApplicants(job)}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    👥
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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

      {/*  Edit Job Modal */}
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
