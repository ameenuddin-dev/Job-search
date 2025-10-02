'use client';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: number;
}

export default function JobCard({
  title,
  company,
  location,
  salary,
}: JobCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 p-6 flex flex-col justify-between">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-500 transition">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{company}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
          {location}
        </span>
        <span className="bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
          ₹{salary.toLocaleString()}
        </span>
        <span className="bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
          Full-Time
        </span>
      </div>

      <button className="mt-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-500 transition">
        Apply Now
      </button>
    </div>
  );
}
