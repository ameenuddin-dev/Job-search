'use client';
import { useState, useEffect } from 'react';
import RecruiterLayout from '@/components/RecruiterLayout';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
  });

  const [messageVisible, setMessageVisible] = useState(false);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const formatCurrency = (value: string) => {
    if (!value) return '';
    const num = Number(value.replace(/\D/g, ''));
    if (isNaN(num)) return '';
    return '₹' + num.toLocaleString('en-IN');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'salary') {
      const numericValue = value.replace(/\D/g, '');
      setForm({ ...form, [name]: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

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

    setForm({
      title: '',
      company: '',
      location: '',
      salary: '',
      description: '',
    });

    // ✅ Show success message
    setMessageVisible(true);
  };

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (messageVisible) {
      const timer = setTimeout(() => setMessageVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [messageVisible]);

  return (
    <RecruiterLayout>
      {/* ✅ Top sliding message */}
      {messageVisible && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center transition-transform duration-500 transform translate-y-0">
          <div className="max-w-md w-full bg-green-500 text-white p-4 rounded-b-xl shadow-lg flex justify-between items-center">
            <span>Job posted successfully!</span>
            <button
              onClick={() => setMessageVisible(false)}
              className="text-white font-bold text-lg"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-lg space-y-6 transform transition-transform hover:-translate-y-1 hover:shadow-3xl duration-300"
        >
          <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
            Post a New Job
          </h1>

          {['title', 'company', 'location'].map((field) => (
            <div key={field} className="relative">
              <input
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
                required
              />
              <label className="absolute left-4 top-2 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all capitalize">
                {field}
              </label>
            </div>
          ))}

          <div className="relative">
            <input
              name="salary"
              value={formatCurrency(form.salary)}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
              required
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
              Salary
            </label>
          </div>

          <div className="relative">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none h-32 transition resize-none"
              required
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
              Job Description
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            Post Job
          </button>
        </form>
      </div>
    </RecruiterLayout>
  );
}
