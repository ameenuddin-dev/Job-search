import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">
        JobPortal
      </Link>
      <div className="space-x-4">
        <Link href="/login" className="hover:text-blue-400">
          Login
        </Link>
        <Link href="/signup" className="hover:text-blue-400">
          Signup
        </Link>
        <Link href="/post-job" className="hover:text-blue-400">
          Post Job
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
