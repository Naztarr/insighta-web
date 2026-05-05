// 'use client';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import api from '@/lib/api';

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await api.post('/auth/logout');
//       window.location.href = '/'; // Hard redirect to clear session/sidebar
//     } catch (err) {
//       console.error("Logout failed", err);
//     }
//   };

//   const navItems = [
//     { name: 'Overview', href: '/dashboard' },
//     { name: 'Profile Explorer', href: '/dashboard/profiles' },
//     { name: 'Account', href: '/dashboard/account' },
//   ];

//   return (
//     <div className="flex min-h-screen bg-white text-black font-sans">
//       {/* SIDEBAR */}
//       <aside className="w-64 border-r border-gray-100 flex flex-col sticky top-0 h-screen bg-white">
//         <div className="p-8">
//           <h1 className="font-black text-2xl tracking-tighter italic">INSIGHTA</h1>
//           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Stage3 Portal</p>
//         </div>

//         {/* SEARCH REQUIREMENT */}
//         <div className="px-6 mb-6">
//           <div className="relative">
//             <input 
//               type="text" 
//               placeholder="Quick Search..." 
//               className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all"
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') router.push(`/dashboard/profiles?name=${e.currentTarget.value}`);
//               }}
//             />
//           </div>
//         </div>
        
//         <nav className="flex-1 px-4 space-y-1">
//           {navItems.map((item) => (
//             <Link 
//               key={item.name}
//               href={item.href} 
//               className={`block p-3 text-sm font-bold rounded-xl transition-all ${
//                 pathname === item.href ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'
//               }`}
//             >
//               {item.name}
//             </Link>
//           ))}
//         </nav>

//         <div className="p-6 border-t border-gray-50">
//            <button 
//              onClick={handleLogout}
//              className="w-full text-left text-xs font-black text-red-500 uppercase tracking-widest hover:opacity-70 transition-opacity"
//            >
//              Terminate Session
//            </button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 bg-white">
//         {children}
//       </main>
//     </div>
//   );
// }

'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await api.post('/auth/logout');
    window.location.href = '/'; 
  };

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 border-r border-gray-100 flex flex-col h-screen sticky top-0 bg-white">
        <div className="p-8">
          <h1 className="font-black text-2xl tracking-tighter italic">INSIGHTA</h1>
        </div>

        {/* SEARCH BAR - Linked to /api/profiles/search */}
        <div className="px-6 mb-8">
          <input 
            type="text" 
            placeholder="Natural Search..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 text-xs font-bold focus:ring-2 focus:ring-black outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') router.push(`/dashboard/profiles?q=${e.currentTarget.value}`);
            }}
          />
          <p className="text-[9px] text-gray-400 mt-2 px-1 uppercase font-bold italic">Try: "males from Nigeria"</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { name: 'Overview', href: '/dashboard' },
            { name: 'Profile Explorer', href: '/dashboard/profiles' },
            { name: 'Account Settings', href: '/dashboard/account' }
          ].map((item) => (
            <Link key={item.name} href={item.href} className={`block p-3 text-sm font-bold rounded-xl transition-all ${
              pathname === item.href ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button onClick={handleLogout} className="text-xs font-black text-red-500 uppercase tracking-widest hover:opacity-50 transition-opacity">
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}