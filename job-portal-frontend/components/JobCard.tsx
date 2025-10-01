import React from 'react';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: number;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  salary,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-1">{company}</p>
      <p className="text-gray-500 dark:text-gray-400 mb-3">{location}</p>
      <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
        ₹{salary.toLocaleString()}
      </p>
      <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors duration-300">
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
