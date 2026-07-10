'use client';

import React, { useState, useEffect } from 'react';
import { Search, Calendar, UserPlus, Settings, FileText, LogOut, ChevronRight } from 'lucide-react';
import { useActivePatient, useActiveEncounter } from '@/design-system/patient-context';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { setActivePatientId } = useActivePatient();
  const { setIsVisitFlowActive } = useActiveEncounter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search commands, patients, or actions... (Ctrl + K to close)"
            className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1">
            <kbd className="bg-slate-100 text-slate-500 font-mono tabular-nums text-[9px] px-1.5 py-0.5 rounded-md font-bold border border-slate-200">ESC</kbd>
          </div>
        </div>

        <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Actions</div>
          
          <button 
            className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left group transition-colors focus:bg-slate-50 outline-none min-h-[44px]"
            onClick={() => { window.dispatchEvent(new CustomEvent('open-new-patient')); setIsOpen(false); }}
          >
            <div className="bg-cyan-50 text-cyan-700 p-1.5 rounded-xl mr-3 group-hover:bg-cyan-100 transition-colors">
              <UserPlus className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-800">Register New Patient</div>
              <div className="text-[11px] text-slate-500">Start the intake workflow for a new walk-in</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-600 transition-colors" />
          </button>

          <button 
            className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left group transition-colors focus:bg-slate-50 outline-none min-h-[44px]"
            onClick={() => { setActivePatientId(null); setIsVisitFlowActive(false); setIsOpen(false); }}
          >
            <div className="bg-emerald-50 text-emerald-700 p-1.5 rounded-xl mr-3 group-hover:bg-emerald-100 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-800">Find Existing Patient</div>
              <div className="text-[11px] text-slate-500">Search by name, ID, or phone number</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
          </button>

          <button 
            className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left group transition-colors focus:bg-slate-50 outline-none min-h-[44px]"
            onClick={() => { setIsOpen(false); }}
          >
            <div className="bg-amber-50 text-amber-700 p-1.5 rounded-xl mr-3 group-hover:bg-amber-100 transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-800">Today's Schedule</div>
              <div className="text-[11px] text-slate-500">View upcoming appointments and availability</div>
            </div>
          </button>

          <div className="px-3 pt-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">System</div>
          
          <button className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-50 text-left group transition-colors min-h-[44px]">
            <div className="bg-slate-100 text-slate-600 p-1.5 rounded-xl mr-3">
              <Settings className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-800">Clinic Settings</div>
            </div>
          </button>
          
          <button className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-red-50 text-left group transition-colors min-h-[44px]">
            <div className="bg-red-50 text-red-600 p-1.5 rounded-xl mr-3 group-hover:bg-red-100">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-red-600">Lock Workstation</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
