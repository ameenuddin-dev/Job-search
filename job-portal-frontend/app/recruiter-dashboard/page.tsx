'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Home, ListChecks, Settings, LogOut } from 'lucide-react';

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
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCharts, setShowCharts] = useState(false);
  const [modalApplicants, setModalApplicants] = useState<Applicant[] | null>(
    null
  );

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const role =
    typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  useEffect(() => {
    if (!token || role !== 'employer') router.push('/login');
  }, [token, role, router]);

  const fetchJobs = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/jobs/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
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

  const viewApplicants = (job: Job) => setModalApplicants(job.applicants);

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error(err);
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

  const jobsData = jobs.map((job) => ({
    name: job.title,
    applicants: job.applicants.length,
  }));
  const statusData = [
    {
      name: 'Open Jobs',
      value: jobs.filter((j) => j.status === 'open').length,
    },
    {
      name: 'Closed Jobs',
      value: jobs.filter((j) => j.status === 'closed').length,
    },
  ];
  const COLORS = ['#4CAF50', '#FF7043'];

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 animate-gradient-x">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-8">Recruiter</h1>
          <nav className="space-y-4">
            <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600">
              <Home size={20} /> Dashboard
            </button>
            <button
              className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
              onClick={() => setShowCharts(!showCharts)}
            >
              <ListChecks size={20} /> Charts
            </button>
          </nav>
        </div>
        <div className="space-y-3 border-t pt-6">
          <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600">
            <Settings size={20} /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-600"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
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

        {/* Job Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto mb-10 space-y-6 transition-transform transform hover:-translate-y-1 duration-300"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
            Post a New Job
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['title', 'company', 'location', 'salary'].map((field) => (
              <div key={field} className="relative">
                <input
                  name={field}
                  placeholder=" "
                  value={(form as any)[field]}
                  onChange={handleChange}
                  className="peer w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
                  required
                />
                <label className="absolute left-4 top-2 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all capitalize">
                  {field}
                </label>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            Post Job
          </button>
        </form>

        {/* Jobs List */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                  onClick={() => setEditJob(job)}
                  className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleStatus(job)}
                  className={`flex-1 py-2 ${
                    job.status === 'open' ? 'bg-green-500' : 'bg-gray-500'
                  } text-white rounded-lg hover:opacity-90 transition`}
                >
                  {job.status === 'open' ? 'Open' : 'Closed'}
                </button>
                <button
                  onClick={async () => {
                    if (!token) return;
                    try {
                      await fetch(`http://localhost:5000/api/jobs/${job._id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      fetchJobs(); // Refresh job list
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>

                <button
                  onClick={() => viewApplicants(job)}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Applicants
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        {showCharts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Applicants per Job</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={jobsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applicants" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                Job Status Overview
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Edit Job Modal */}
        {editJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all hover:scale-105 duration-300">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Edit Job
              </h2>
              <div className="space-y-4">
                {['title', 'company', 'location', 'salary'].map((field) => (
                  <input
                    key={field}
                    type={field === 'salary' ? 'number' : 'text'}
                    value={(editJob as any)[field]}
                    onChange={(e) =>
                      setEditJob({
                        ...editJob,
                        [field]:
                          field === 'salary'
                            ? Number(e.target.value)
                            : e.target.value,
                      })
                    }
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
                  />
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={async () => {
                    if (!editJob) return;
                    try {
                      await fetch(
                        `http://localhost:5000/api/jobs/${editJob._id}`,
                        {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify(editJob),
                        }
                      );
                      setEditJob(null);
                      fetchJobs();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditJob(null)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applicants Modal */}
        {modalApplicants && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Applicants
              </h2>
              <ul className="space-y-2">
                {modalApplicants.map((app, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-white/80 rounded-xl shadow hover:shadow-md transition"
                  >
                    {app.name} - {app.email}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setModalApplicants(null)}
                className="mt-4 w-full py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
