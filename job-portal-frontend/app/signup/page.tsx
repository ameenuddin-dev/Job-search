'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
  });

  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [visible, setVisible] = useState(false); // for slide bar animation

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage(null);
    setVisible(false);

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: 'success',
          text: 'Signup successful! Please login.',
        });
        setVisible(true);

        // Redirect after short delay
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Signup failed' });
        setVisible(true);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error connecting to server' });
      setVisible(true);
    }
  };

  // Auto-hide the top bar after 10 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setVisible(false), 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Close button handler
  const closeMessage = () => setVisible(false);

  return (
    <>
      <Navbar />

      {/* ✅ Top sliding notification bar with close button */}
      {message && (
        <div
          className={`fixed top-0 left-0 w-full z-50 flex justify-center items-center transition-transform duration-700 ${
            visible ? 'translate-y-0' : '-translate-y-20'
          }`}
        >
          <div
            className={`w-full max-w-md mx-4 flex justify-between items-center py-4 px-6 rounded-b-lg shadow-lg text-white ${
              message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={closeMessage}
              className="ml-4 text-white font-bold text-lg focus:outline-none"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-4">
        <form
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6 relative"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-6">
            Create Account
          </h2>

          <div className="relative z-0 w-full group">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder=" "
              className="peer block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 pt-5 pb-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              required
            />
            <label
              htmlFor="name"
              className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-500 dark:peer-focus:text-purple-400"
            >
              Name
            </label>
          </div>

          <div className="relative z-0 w-full group">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              className="peer block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 pt-5 pb-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-500 dark:peer-focus:text-purple-400"
            >
              Email
            </label>
          </div>

          <div className="relative z-0 w-full group">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              className="peer block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 pt-5 pb-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-blue-500 dark:peer-focus:text-purple-400"
            >
              Password
            </label>
          </div>

          <div className="w-full">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800"
            >
              <option value="candidate">Candidate</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-purple-400"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-blue-500 dark:text-purple-400 font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
