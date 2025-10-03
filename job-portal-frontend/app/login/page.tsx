'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
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
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);

        setMessage({ type: 'success', text: 'Login successful!' });
        setVisible(true);

        const role = data.user.role?.toLowerCase();
        let routerPath = '';
        if (role === 'employer' || role === 'recruiter') {
          routerPath = '/recruiter/dashboard';
        } else if (role === 'candidate') {
          routerPath = '/candidate/dashboard';
        } else {
          setMessage({ type: 'error', text: 'Unknown role. Cannot redirect.' });
          setVisible(true);
          // return;
        }
        console.log('redirection');
        setTimeout(() => {
          router.push(routerPath);
        }, 1000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Login failed' });
        setVisible(true);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error connecting to server' });
      setVisible(true);
    }
  };

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
            Login
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-300"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <a
              href="/signup"
              className="text-blue-500 dark:text-purple-400 hover:underline"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
