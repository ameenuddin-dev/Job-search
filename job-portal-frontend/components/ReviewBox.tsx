import React from 'react';
import CountUp from 'react-countup';

interface Applicant {
  name?: string;
  rating?: number;
}

interface Job {
  applicants?: Applicant[];
}

interface ReviewsBoxProps {
  jobs: Job[];
}

const ReviewsBox: React.FC<ReviewsBoxProps> = ({ jobs }) => {
  const allApplicants = jobs.flatMap((job) => job.applicants || []);
  const ratedApplicants = allApplicants.filter((a) => a.rating !== undefined);

  const total = ratedApplicants.length || 1;
  const positive = ratedApplicants.filter((a) => (a.rating || 0) >= 4).length;
  const neutral = ratedApplicants.filter((a) => (a.rating || 0) === 3).length;
  const negative = ratedApplicants.filter((a) => (a.rating || 0) <= 2).length;

  const positivePercent = (positive / total) * 100;
  const neutralPercent = (neutral / total) * 100;
  const negativePercent = (negative / total) * 100;

  const items = [
    {
      label: 'Positive Reviews',
      percent: positivePercent,
      color: 'bg-orange-500',
    },
    {
      label: 'Neutral Reviews',
      percent: neutralPercent,
      color: 'bg-orange-400',
    },
    {
      label: 'Negative Reviews',
      percent: negativePercent,
      color: 'bg-orange-300',
    },
  ];

  return (
    <div className="bg-white w-[500px] rounded-3xl shadow-xl border border-gray-200 p-6 flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Reviews</h3>

      {items.map((item) => (
        <div key={item.label} className="mb-5">
          <div className="flex justify-between text-sm font-semibold text-gray-800 mb-1">
            <span>{item.label}</span>
            <span>
              <CountUp end={Math.round(item.percent)} duration={1.2} />%
            </span>
          </div>
          <div className="w-full bg-gray-200 h-[6px] rounded-full overflow-hidden">
            <div
              className={`${item.color} h-[6px] rounded-full transition-all duration-700`}
              style={{ width: `${item.percent}%` }}
            ></div>
          </div>
        </div>
      ))}

      <button className="mt-5 py-2 bg-gray-900 text-white text-sm rounded-md shadow hover:bg-gray-800">
        View all reviews
      </button>
    </div>
  );
};

export default ReviewsBox;
