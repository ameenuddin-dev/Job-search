'use client';

import { useState } from 'react';

export default function Profile() {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() !== '') {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <form className="bg-white p-6 rounded-2xl shadow max-w-lg space-y-4">
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded-lg"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded-lg"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="text"
            className="w-full border p-2 rounded-lg"
            placeholder="Enter your phone"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Resume</label>
          <input type="file" className="w-full border rounded-lg" />
        </div>

        {/* Skills */}
        <div>
          <label className="block mb-1 font-medium">Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 border p-2 rounded-lg"
              placeholder="Add a skill"
            />
            <button
              type="button"
              onClick={addSkill}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Save Profile
        </button>
      </form>
    </div>
  );
}
