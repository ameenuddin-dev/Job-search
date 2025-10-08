'use client';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  description?: string;
  status?: string; // optional for mapping
}

interface Application {
  _id: string;
  job: Job;
  status: 'pending' | 'shortlisted' | 'rejected' | 'Applied';
}

interface Props {
  appliedJobs: Application[];
}

export default function MyApplications({ appliedJobs }: Props) {
  if (appliedJobs.length === 0) return <p>No applications yet.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {appliedJobs.map((app) => (
        <div
          key={app._id}
          className="border p-4 rounded shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">{app.job.title}</h2>
          <p className="text-gray-600">{app.job.company}</p>
          <p className="text-gray-500">{app.job.location}</p>
          <p className="font-medium mt-1">Salary: ₹{app.job.salary}</p>
          <p
            className={`mt-2 font-medium ${
              app.status === 'shortlisted'
                ? 'text-green-600'
                : app.status === 'rejected'
                ? 'text-red-600'
                : 'text-gray-700'
            }`}
          >
            Status: {app.status}
          </p>
        </div>
      ))}
    </div>
  );
}
