'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Function to check if user is logged in
  const fetchUser = () => {
    api.get('/user/me')
      .then(res => {router.push('/dashboard');})
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null); // Clear state locally
      window.location.href = '/';
      // Optional: window.location.href = '/'; 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/auth/github';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black tracking-tighter">INSIGHTA</h1>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
          ) : user ? (
            /* SHOW THIS WHEN LOGGED IN */
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user.username}</p>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-red-500 hover:underline font-medium"
                >
                  Logout
                </button>
              </div>
              <img src={user.avatarUrl} className="w-10 h-10 rounded-full border" alt="User" />
            </div>
          ) : (
            /* SHOW THIS WHEN LOGGED OUT */
            <button 
              onClick={handleLogin}
              className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Login with GitHub
            </button>
          )}
        </div>
      </nav>

      <main className="p-10">
        {!user && !loading && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-400">Please log in to view data</h2>
          </div>
        )}
        {user && (
          <div>
            <h2 className="text-3xl font-extrabold">Welcome, {user.username}</h2>
            {/* Seeded profiles will go here */}
          </div>
        )}
      </main>
    </div>
  );
}