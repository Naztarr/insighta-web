// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import api from '@/lib/api'; // Ensure this points to your axios instance

// // Matches the Java ProfileResponseData record
// interface Profile {
//   id: string;
//   name: string;
//   gender: string;
//   gender_probability: number;
//   age: number;
//   age_group: string;
//   country_id: string;
//   country_name: string;
//   country_probability: number;
//   created_at: string;
// }

// export default function ProfileExplorer() {
//   // 1. Full State Coverage for all @RequestParams in your Controller
//   const [filterState, setFilterState] = useState({
//     gender: '',
//     ageGroup: '',
//     countryId: '',
//     minAge: '',
//     maxAge: '',
//     minGenderProbability: '',
//     minCountryProbability: '',
//     sortBy: 'created_at',
//     order: 'desc',
//     page: 1,
//     limit: 12
//   });

//   const [profiles, setProfiles] = useState<Profile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [totalElements, setTotalElements] = useState(0);

//   // 2. The Handler for all inputs
//   const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFilterState(prev => ({
//       ...prev,
//       [name]: value,
//       page: 1 // Reset to page 1 when any filter changes
//     }));
//   };

//   // 3. The Engine: Mapping frontend state to Backend snake_case params
//   const fetchProfiles = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Create the payload and map camelCase to snake_case for your Controller
//       const apiParams: any = {
//         gender: filterState.gender,
//         age_group: filterState.ageGroup,
//         country_id: filterState.countryId,
//         min_age: filterState.minAge,
//         max_age: filterState.maxAge,
//         min_gender_probability: filterState.minGenderProbability,
//         min_country_probability: filterState.minCountryProbability,
//         sort_by: filterState.sortBy,
//         order: filterState.order,
//         page: filterState.page,
//         limit: filterState.limit
//       };

//       // Clean up empty strings so we don't send "?gender="
//     const cleanEntries = Object.entries(apiParams)
//   .filter(([_, v]) => v !== "" && v != null);

// // Convert all values to strings so URLSearchParams is happy
//     const stringEntries = cleanEntries.map(([k, v]) => [k, String(v)]);

// // Create the query string
//     const params = new URLSearchParams(stringEntries).toString();
//       const res = await api.get(`/api/profiles?${params}`);
      
//       // PageProfileResponse mapping
//       setProfiles(res.data.data);
//       setTotalElements(res.data.total);
//     } catch (err) {
//       console.error("Error fetching profiles:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [filterState]);

//   useEffect(() => {
//     fetchProfiles();
//   }, [fetchProfiles]);

//   return (
//     <div className="p-8 max-w-7xl mx-auto min-h-screen bg-white text-black">
//       <header className="mb-10">
//         <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Seeded Profiler</h1>
//         <p className="text-gray-500 font-medium">Monitoring {totalElements} data points in Stage3 Database</p>
//       </header>

//       {/* --- FILTER BAR --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12 bg-gray-50 p-6 rounded-2xl border border-gray-100">
//         <div>
//           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Gender</label>
//           <select name="gender" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm">
//             <option value="">All</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Age Group</label>
//           <select name="ageGroup" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm">
//             <option value="">All</option>
//             <option value="child">Child</option>
//             <option value="teenager">Teenager</option>
//             <option value="adult">Adult</option>
//             <option value="senior">Senior</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Country ID</label>
//           <input name="countryId" placeholder="NG" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm uppercase" maxLength={2} />
//         </div>

//         <div>
//           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Min Age</label>
//           <input name="minAge" type="number" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm" />
//         </div>

//         <div>
//           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sort By</label>
//           <select name="sortBy" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm">
//             <option value="created_at">Date Created</option>
//             <option value="age">Age</option>
//             <option value="gender_probability">Confidence</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Order</label>
//           <select name="order" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm">
//             <option value="desc">Descending</option>
//             <option value="asc">Ascending</option>
//           </select>
//         </div>
//       </div>

//       {/* --- DATA GRID --- */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-gray-50 animate-pulse rounded-2xl" />)}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {profiles.map((p) => (
//             <div key={p.id} className="border border-gray-100 p-5 rounded-2xl hover:shadow-xl hover:border-black transition-all group">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xs">
//                   {p.country_id}
//                 </div>
//                 <span className="text-[10px] font-mono text-gray-400">
//                   {new Date(p.created_at).toLocaleDateString()}
//                 </span>
//               </div>
              
//               <h3 className="font-bold text-gray-900 truncate">{p.name}</h3>
//               <p className="text-xs text-gray-400 mb-4">{p.country_name}</p>

//               <div className="space-y-2">
//                 <div className="flex justify-between text-xs">
//                   <span className="text-gray-500 uppercase font-bold text-[9px]">Gender</span>
//                   <span className="font-bold uppercase">{p.gender} ({(p.gender_probability * 100).toFixed(0)}%)</span>
//                 </div>
//                 <div className="flex justify-between text-xs">
//                   <span className="text-gray-500 uppercase font-bold text-[9px]">Age Insight</span>
//                   <span className="font-bold uppercase">{p.age} — {p.age_group}</span>
//                 </div>
//               </div>
              
//               <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
//                 <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
//                   {p.id.split('-')[0]}...
//                 </span>
//                 <span className="text-[9px] font-bold text-green-600 uppercase">
//                   Verified Data
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* --- EMPTY STATE --- */}
//       {!loading && profiles.length === 0 && (
//         <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
//           <p className="text-gray-400 font-medium italic">No profiles matching these specific metrics.</p>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Profile, PageProfileResponse } from '../../types';

export default function ProfileExplorer() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q'); // Natural language query from Sidebar

  // State matching ProfileFilterRequest.java
  const [filterState, setFilterState] = useState({
    gender: '',
    ageGroup: '',
    countryId: '',
    minAge: '',
    maxAge: '',
    sortBy: 'created_at',
    order: 'desc',
    page: 1,
    limit: 12
  });

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      let response;

      if (q) {
        // HIT @GetMapping("/search")
        response = await api.get<PageProfileResponse>('/api/profiles/search', {
          params: { q, page: filterState.page, limit: filterState.limit }
        });
      } else {
        // HIT @GetMapping (Standard Filter)
        const params: any = {
          gender: filterState.gender,
          age_group: filterState.ageGroup,
          country_id: filterState.countryId,
          min_age: filterState.minAge,
          max_age: filterState.maxAge,
          sort_by: filterState.sortBy,
          order: filterState.order,
          page: filterState.page,
          limit: filterState.limit
        };

        // Remove empty filters
        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== "" && v != null)
        );
        

        response = await api.get<PageProfileResponse>('/api/profiles', { params: cleanParams });
      }

      const result = response.data;

    if (result) {
      setProfiles(result.data || []); 
      setMeta({ 
        total: Number(result.total) || 0, 
        totalPages: result.totalPages || 1 
      });
    }
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [filterState, q]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilterState(prev => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            {q ? `Search: ${q}` : "Profile Explorer"}
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">
            Result Count: {meta.total} Entities
          </p>
        </div>
        
        {/* CSV Export Button using your controller's @GetMapping("/export") */}
        <button 
          onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/export`, '_blank')}
          className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-green-700 transition-colors"
        >
          Export Dataset
        </button>
      </header>

      {/* --- FILTERS (Hidden during active NL search) --- */}
      {!q && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10 bg-gray-50 p-6 rounded-3xl border border-gray-100">
           {/* Reuse your existing <select> and <input> fields here with handleFilterChange */}
           <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Gender</label>
            <select name="gender" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-bold">
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
           <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Age Group</label>
           <select name="ageGroup" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm">
             <option value="">All</option>
             <option value="child">Child</option>
             <option value="teenager">Teenager</option>
             <option value="adult">Adult</option>
             <option value="senior">Senior</option>
           </select>
         </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Country ID</label>
          <input name="countryId" placeholder="NG" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm uppercase" maxLength={2} />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Min Age</label>
          <input name="minAge" type="number" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm" />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sort By</label>
          <select name="sortBy" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm">
            <option value="created_at">Date Created</option>
            <option value="age">Age</option>
            <option value="gender_probability">Confidence</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Order</label>
          <select name="order" onChange={handleFilterChange} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
      )}

      {/* --- DATA GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(8).fill(0).map((_, i) => <div key={i} className="h-56 bg-gray-50 animate-pulse rounded-3xl" />)
        ) : (
          profiles.map((p) => (
            <div key={p.id} className="border border-gray-100 p-6 rounded-3xl hover:border-black transition-all group bg-white shadow-sm hover:shadow-xl">
               <div className="flex justify-between items-start mb-6">
                  <span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-black uppercase">{p.country_id}</span>
                  <span className="text-[10px] font-mono text-gray-300">#{p.id.split('-')[0]}</span>
               </div>
               <h3 className="font-black text-lg mb-1 truncate">{p.name}</h3>
               <p className="text-xs text-gray-400 font-bold uppercase mb-6">{p.country_name}</p>
               
               <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-gray-50 rounded-xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Age</p>
                    <p className="text-xs font-black">{p.age}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Gender</p>
                    <p className="text-xs font-black uppercase text-blue-600">{p.gender}</p>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* --- PAGINATION (Directly from PageProfileResponse) --- */}
      <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
        <p className="text-[10px] font-black text-gray-400 uppercase">
          Page {filterState.page} / {meta.totalPages}
        </p>
        <div className="flex gap-2">
          <button 
            disabled={filterState.page <= 1 || loading}
            onClick={() => setFilterState(p => ({ ...p, page: p.page - 1 }))}
            className="px-6 py-2 border border-gray-200 rounded-xl text-[10px] font-black hover:bg-gray-50 disabled:opacity-20 uppercase"
          >
            Previous
          </button>
          <button 
            disabled={filterState.page >= meta.totalPages || loading}
            onClick={() => setFilterState(p => ({ ...p, page: p.page + 1 }))}
            className="px-6 py-2 bg-black text-white rounded-xl text-[10px] font-black hover:bg-gray-800 disabled:opacity-20 uppercase"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
