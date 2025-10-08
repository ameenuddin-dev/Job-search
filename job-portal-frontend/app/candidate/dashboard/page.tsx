'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaBriefcase,
  FaSave,
  FaUser,
  FaClipboardList,
  FaBars,
} from 'react-icons/fa';

import AvailableJobs from '@/components/candidate/AvailableJobs';
import MyApplications from '@/components/candidate/MyApplications';
import SavedJobs from '@/components/candidate/SavedJobs';
import Profile from '@/components/candidate/Profile';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  description?: string;
  status?: string;
}

export default function CandidateDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'available' | 'saved' | 'applied' | 'profile'
  >('available');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch open jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
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
  }, [token]);

  // Fetch saved jobs
  const fetchSavedJobs = async () => {
    try {
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/jobs/saved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch saved jobs');
      const data: Job[] = await res.json();
      setSavedJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch applied jobs
  const fetchAppliedJobs = async () => {
    try {
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/jobs/applied', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch applied jobs');
      const data: any = await res.json();
      const jobsMapped = data.map((a: any) => ({
        ...a.job,
        status: a.status,
      }));
      setAppliedJobs(jobsMapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
    fetchAppliedJobs();
  }, []);

  const handleApplyJob = (job: Job) => {
    if (!appliedJobs.find((j) => j._id === job._id)) {
      setAppliedJobs([...appliedJobs, { ...job, status: 'Applied' }]);
    }
  };
  const handleSaveJob = async (job: Job) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please log in to save jobs.');
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/jobs/${job._id}/save`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await res.text(); // <-- get raw backend response
      console.log('Backend raw response:', res.status, text);

      if (!res.ok) throw new Error(`Failed to save job: ${res.status} ${text}`);

      const data = JSON.parse(text);
      console.log('Parsed backend data:', data);

      // Update frontend state
      const alreadySaved = savedJobs.some((j) => j._id === job._id);
      if (alreadySaved) {
        setSavedJobs(savedJobs.filter((j) => j._id !== job._id));
        alert(`❎ Job removed: ${job.title}`);
      } else {
        setSavedJobs([...savedJobs, job]);
        alert(`💾 Job saved: ${job.title}`);
      }
    } catch (err: any) {
      console.error('Error saving job:', err);
      alert(err.message || 'Error saving job');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading jobs...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars size={20} />
          </button>
          <h1 className="text-2xl font-bold text-blue-600">JobPortal</h1>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => {
            localStorage.clear();
            router.push('/login');
          }}
        >
          Logout
        </button>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } md:block w-64 bg-white shadow-md p-6 space-y-4`}
        >
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <ul className="space-y-3 text-gray-700">
            <li
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-50 ${
                activeTab === 'available'
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : ''
              }`}
              onClick={() => setActiveTab('available')}
            >
              <FaBriefcase /> Available Jobs
            </li>
            <li
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-50 ${
                activeTab === 'applied'
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : ''
              }`}
              onClick={() => setActiveTab('applied')}
            >
              <FaClipboardList /> My Applications
            </li>
            <li
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-50 ${
                activeTab === 'saved'
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : ''
              }`}
              onClick={() => setActiveTab('saved')}
            >
              <FaSave /> Saved Jobs
            </li>
            <li
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-50 ${
                activeTab === 'profile'
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : ''
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser /> Profile
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'available' && (
            <AvailableJobs onApply={handleApplyJob} onSave={handleSaveJob} />
          )}
          {activeTab === 'applied' && (
            <MyApplications
              appliedJobs={appliedJobs.map((job) => ({
                _id: job._id, // unique ID for application
                job: job, // wrap the Job object
                status:
                  (job.status as
                    | 'pending'
                    | 'shortlisted'
                    | 'rejected'
                    | 'Applied') || 'Applied',
              }))}
            />
          )}

          {activeTab === 'saved' && <SavedJobs reload={true} />}
          {activeTab === 'profile' && <Profile />}
        </main>
      </div>
    </div>
  );
}
