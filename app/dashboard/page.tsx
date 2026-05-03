// // app/dashboard/page.tsx
// export default function OverviewPage() {
//   return (
//     <div className="p-12 max-w-4xl">
//       <div className="bg-blue-600 rounded-3xl p-10 text-white shadow-2xl">
//         <h2 className="text-4xl font-black tracking-tighter mb-4">WELCOME TO THE DASHBOARD</h2>
//         <p className="text-blue-100 text-lg mb-8 max-w-md">
//           Your connection to the backend is active. Use the sidebar to explore seeded profiles or manage data.
//         </p>
//         <a 
//           href="/dashboard/profiles" 
//           className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors"
//         >
//           Open Profile Explorer →
//         </a>
//       </div>

//       <div className="mt-10 grid grid-cols-2 gap-6">
//         <div className="border border-gray-100 p-6 rounded-2xl">
//           <h4 className="font-bold mb-2 text-gray-400 uppercase text-[10px]">Database Connection</h4>
//           <p className="text-sm font-medium text-green-600">● Live / Connected</p>
//         </div>
//         <div className="border border-gray-100 p-6 rounded-2xl">
//           <h4 className="font-bold mb-2 text-gray-400 uppercase text-[10px]">System Version</h4>
//           <p className="text-sm font-medium">v1.0.4-stable</p>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Function to check if user is logged in
  const fetchUser = () => {
    api.get('/user/me')
      .then(res => setUser(res.data))
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