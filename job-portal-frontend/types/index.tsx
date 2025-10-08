export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  description?: string;
  status?: 'open' | 'closed' | 'Applied';
  applicants?: { _id: string; name: string; status: string }[];
}
