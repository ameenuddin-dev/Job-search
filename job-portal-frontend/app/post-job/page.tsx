'use client';
import { useState } from 'react';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  //  Generate AI description
  const generateDescription = async () => {
    if (!form.title || !form.company) {
      alert('Please enter both Job Title and Company name first!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:5000/api/jobs/generate-description',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // JWT/Auth header if you have authentication
            // Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: form.title,
            company: form.company,
          }),
        }
      );

      const data = await res.json();
      if (data.description) {
        setForm({ ...form, description: data.description });
      } else {
        alert('Failed to generate description. Try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error while generating description.');
    } finally {
      setLoading(false);
    }
  };

  // Post Job to backend
  const postJob = async () => {
    if (!form.title || !form.company) {
      alert('Title and Company are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // JWT/Auth header if needed
          // Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.job) {
        alert('Job posted successfully!');
        setForm({
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
      console.error(err);
      alert('Server error while posting job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Post a New Job</h2>

      <input
        type="text"
        placeholder="Job Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <input
        type="text"
        placeholder="Company"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <input
        type="text"
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <input
        type="text"
        placeholder="Salary"
        value={form.salary}
        onChange={(e) => setForm({ ...form, salary: e.target.value })}
        className="border p-2 w-full rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={generateDescription}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Generating...' : '✨ Generate with AI'}
        </button>
      </div>

      <textarea
        placeholder="Job Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={6}
        className="border p-2 w-full rounded"
      />

      <button
        onClick={postJob}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Posting...' : 'Post Job'}
      </button>
    </div>
  );
}
