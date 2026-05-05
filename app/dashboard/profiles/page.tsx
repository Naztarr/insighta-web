'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Profile, PageProfileResponse } from '../../types';

function ProfileExplorerContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q'); // Natural language query from Sidebar
  console.log(q);

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
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchProfileDetails = async (id: string) => {
  setDetailsLoading(true);
  try {
    const response = await api.get<{status: string, data: Profile}>(`/api/profiles/${id}`);
    // Based on ProfileSuccessResp, the profile is in response.data.data
    setSelectedProfile(response.data.data);
  } catch (err) {
    console.error("Failed to fetch details", err);
    } finally {
    setDetailsLoading(false);
    }
  };

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      let response;

      if (q) {
        // HIT @GetMapping("/search")
        response = await api.get<PageProfileResponse>('/api/profiles/search', {
          params: { q, page: filterState.page, limit: filterState.limit }
        });
        console.log(response);
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
      console.log('This is the result '+result.data);

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
  useEffect(() => {
  setFilterState(prev => ({ ...prev, page: 1 }));
}, [q]);

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
          className=" cursor-pointer bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-green-700 transition-colors"
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
            <div key={p.id} 
              onClick={() => fetchProfileDetails(p.id)}
              className="cursor-pointer border border-gray-100 p-6 rounded-3xl hover:border-black transition-all group bg-white shadow-sm hover:shadow-xl active:scale-95">
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
        {/* --- DETAILS MODAL --- */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedProfile(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black font-black uppercase text-[10px] tracking-widest"
            >
              Close
            </button>

            <div className="mb-8">
              <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                {selectedProfile.country_id} Entity
              </span>
              <h2 className="text-4xl font-black tracking-tighter uppercase mt-4">{selectedProfile.name}</h2>
              <p className="text-gray-400 font-bold uppercase text-xs mt-1">{selectedProfile.country_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-3xl">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Age Group</p>
                <p className="text-xl font-black uppercase">{selectedProfile.age_group}</p>
                <p className="text-xs font-bold text-gray-400">Actual Age: {selectedProfile.age}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Gender</p>
                <p className="text-xl font-black uppercase text-blue-600">{selectedProfile.gender}</p>
                <p className="text-xs font-bold text-gray-400">{(selectedProfile.gender_probability * 100).toFixed(1)}% Confidence</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl col-span-2">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">System Metadata</p>
                <p className="text-[10px] font-mono text-gray-500 break-all">UUID: {selectedProfile.id}</p>
                <p className="text-[10px] font-mono text-gray-500 mt-1">Processed: {new Date(selectedProfile.created_at).toLocaleString()}</p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedProfile(null)}
              className=" cursor-pointer w-full mt-8 bg-black text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-gray-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. Export a default function that wraps the content in Suspense
export default function ProfileExplorer() {
  return (
    <Suspense fallback={
      <div className="p-8 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">
          Loading Explorer...
        </p>
      </div>
    }>
      <ProfileExplorerContent />
    </Suspense>
  );
}
