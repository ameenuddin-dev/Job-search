'use client';
import { useState, useEffect } from 'react';
import RecruiterLayout from '@/components/RecruiterLayout';
import { CheckCircle, X, Sparkles } from 'lucide-react';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
  });

  const [messageVisible, setMessageVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // 💰 Currency format
  const formatCurrency = (value: string) => {
    if (!value) return '';
    const num = Number(value.replace(/\D/g, ''));
    if (isNaN(num)) return '';
    return '₹' + num.toLocaleString('en-IN');
  };

  // 🧾 Form input handler
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

  // 🪄 Generate AI description (mocked here)
  const generateDescription = async () => {
    if (!form.title || !form.company) {
      alert('Please enter both Job Title and Company name first!');
      return;
    }

    setLoading(true);
    // 👉 You can replace this with your own backend API route that calls OpenAI or Gemini API
    const prompt = `Write a professional and engaging job description for a ${form.title} position at ${form.company}. 
    Mention key responsibilities, skills required, and company culture in 120-150 words.`;

    // Mock AI delay
    await new Promise((res) => setTimeout(res, 1500));

    const fakeAIResponse = `
We are looking for a passionate ${form.title} to join our dynamic team at ${form.company}. 
You will play a key role in developing innovative solutions, collaborating across teams, 
and delivering impactful results. 

💼 **Responsibilities:**
- Design, implement, and optimize modern applications.
- Collaborate with cross-functional teams for smooth project delivery.
- Stay updated with industry trends and technologies.

🎯 **Skills Required:**
- Strong analytical thinking, communication, and teamwork.
- Proficiency in relevant technologies and frameworks.

Join ${form.company} to be part of an innovative, growth-driven environment that values creativity and excellence.
`;

    setForm({ ...form, description: fakeAIResponse.trim() });
    setLoading(false);
  };

  // 📤 Submit handler
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

    setMessageVisible(true);
  };

  // ⏱️ Hide success toast after few seconds
  useEffect(() => {
    if (messageVisible) {
      const timer = setTimeout(() => setMessageVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [messageVisible]);

  return (
    <RecruiterLayout>
      {/* ✅ Success Toast */}
      <div
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
          messageVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}
      >
        <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <CheckCircle size={22} className="text-white" />
          <span className="font-medium">Job posted successfully!</span>
          <button onClick={() => setMessageVisible(false)}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* 🧱 Form + Live Preview */}
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-6 flex flex-col lg:flex-row items-start justify-center gap-8">
        {/* === Form Section === */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white/70 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/30
                     transform transition-all hover:-translate-y-1 hover:shadow-3xl duration-300 space-y-6"
        >
          <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Post a New Job
          </h1>

          {['title', 'company', 'location'].map((field) => (
            <div key={field} className="relative">
              <input
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full p-4 border border-gray-300 rounded-2xl bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
                required
              />
              <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all capitalize">
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
              className="peer w-full p-4 border border-gray-300 rounded-2xl bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition"
              required
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
              Salary
            </label>
          </div>

          {/* ✨ AI Description Generator */}
          <div className="relative">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full p-4 border border-gray-300 rounded-2xl bg-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none h-32 resize-none transition"
              required
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all">
              Job Description
            </label>

            <button
              type="button"
              onClick={generateDescription}
              disabled={loading}
              className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition"
            >
              <Sparkles size={16} />
              {loading ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] active:scale-95 transition-transform duration-300"
          >
            Post Job
          </button>
        </form>

        {/* === Live Preview Card === */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-white/30 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-1 duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {form.title || 'Your Job Title'}
          </h2>
          <p className="text-gray-600 font-medium mb-2">
            {form.company || 'Company Name'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            📍 {form.location || 'Location not specified'}
          </p>
          <p className="text-lg font-semibold text-blue-600 mb-4">
            {form.salary
              ? formatCurrency(form.salary) + ' /month'
              : 'Salary TBD'}
          </p>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {form.description ||
              'Job description will appear here as you type.'}
          </p>
        </div>
      </div>
    </RecruiterLayout>
  );
}
