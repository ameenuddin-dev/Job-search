import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white/70 backdrop-blur-md shadow-md border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
      <Link
        href="/"
        className="font-extrabold text-2xl text-blue-700 tracking-wide hover:text-blue-800 transition"
      >
        Job<span className="text-indigo-500">Portal</span>
      </Link>

      <div className="space-x-6">
        <Link
          href="/login"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="text-gray-700 hover:text-blue-600 font-medium transition"
        >
          Signup
        </Link>
        <Link
          href="/post-job"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          + Post Job
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
