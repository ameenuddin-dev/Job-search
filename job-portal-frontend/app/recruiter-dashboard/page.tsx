'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  applicants: Applicant[];
}

export default function RecruiterDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
  });
  const [modalApplicants, setModalApplicants] = useState<Applicant[] | null>(
    null
  );
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const role =
    typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  // Redirect if not employer
  useEffect(() => {
    if (!token || role !== 'employer') {
      router.push('/login');
    }
  }, [token, role, router]);

  const fetchJobs = async (pageNumber = 1) => {
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/jobs/my?page=${pageNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.length < 6) setHasMore(false);
      setJobs((prev) => (pageNumber === 1 ? data : [...prev, ...data]));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!token) return;
    try {
      await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          salary: Number(form.salary),
          status: 'open',
        }),
      });
      setForm({ title: '', company: '', location: '', salary: '' });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (job: Job) => setEditJob(job);
  const saveJob = async () => {
    if (!editJob || !token) return;
    try {
      await fetch(`http://localhost:5000/api/jobs/${editJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editJob),
      });
      setEditJob(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = (id: string) => setDeleteJobId(id);
  const deleteJob = async () => {
    if (!deleteJobId || !token) return;
    try {
      await fetch(`http://localhost:5000/api/jobs/${deleteJobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteJobId(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (job: Job) => {
    if (!token) return;
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      await fetch(`http://localhost:5000/api/jobs/${job._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const viewApplicants = (job: Job) => setModalApplicants(job.applicants);

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Logout failed', err);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-xl mb-6 shadow">
        <h1 className="text-xl font-bold">Recruiter Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>

      {/* Post Job Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto mb-6 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-700">Post a New Job</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
          />
          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
          />
          <input
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-300"
        >
          Post Job
        </button>
      </form>

      {/* Search Bar */}
      <div className="max-w-5xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by title, company, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        />
      </div>

      {/* Jobs List */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              {job.title}
            </h3>
            <p className="text-gray-600 mb-1">Company: {job.company}</p>
            <p className="text-gray-600 mb-1">
              Location: {job.location} | Salary: ₹{job.salary}
            </p>
            <p className="text-gray-600 mb-1">
              Status: {job.status.toUpperCase()}
            </p>
            <p className="text-gray-600 mb-4">
              Applicants: {job.applicants.length}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openEditModal(job)}
                className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition"
              >
                Edit
              </button>
              <button
                onClick={() => toggleStatus(job)}
                className={`flex-1 py-2 ${
                  job.status === 'open'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                } text-white rounded-lg font-medium transition`}
              >
                {job.status === 'open' ? 'Open' : 'Closed'}
              </button>
              <button
                onClick={() => confirmDelete(job._id)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
              >
                Delete
              </button>
              <button
                onClick={() => viewApplicants(job)}
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
              >
                Applicants
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setPage(page + 1);
              fetchJobs(page + 1);
            }}
            className="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Edit Job Modal */}
      {editJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <h3 className="text-xl font-bold">Edit Job</h3>
            <input
              type="text"
              value={editJob.title}
              onChange={(e) =>
                setEditJob({ ...editJob, title: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
            <input
              type="text"
              value={editJob.company}
              onChange={(e) =>
                setEditJob({ ...editJob, company: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
            <input
              type="text"
              value={editJob.location}
              onChange={(e) =>
                setEditJob({ ...editJob, location: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
            <input
              type="number"
              value={editJob.salary}
              onChange={(e) =>
                setEditJob({ ...editJob, salary: Number(e.target.value) })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
            <div className="flex gap-3">
              <button
                onClick={saveJob}
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditJob(null)}
                className="flex-1 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteJobId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-4">
            <h3 className="text-xl font-bold">Confirm Delete</h3>
            <p>Are you sure you want to delete this job?</p>
            <div className="flex gap-3">
              <button
                onClick={deleteJob}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteJobId(null)}
                className="flex-1 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {modalApplicants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <h3 className="text-xl font-bold mb-2">Applicants</h3>
            <table className="w-full text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border-b">Name</th>
                  <th className="p-2 border-b">Email</th>
                </tr>
              </thead>
              <tbody>
                {modalApplicants.map((app, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{app.name}</td>
                    <td className="p-2 border-b">{app.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setModalApplicants(null)}
                className="flex-1 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
