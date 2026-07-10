'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/clinic-state';
import { SEED_USERS } from '@/lib/types';
import { Shield, Key, Eye, EyeOff, CheckCircle2, FileLock2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { currentUser, setCurrentUser } = useClinic();
  const [selectedRole, setSelectedRole] = useState<'dentist' | 'staff'>(currentUser.role);
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role: 'dentist' | 'staff') => {
    setSelectedRole(role);
    const userObj = SEED_USERS.find(u => u.role === role);
    if (userObj) {
      setCurrentUser(userObj);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 600); // realistic small delay
  };

  return (
    <div id="login-screen-wrapper" className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F8F7F5]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Banner with clinic logo aesthetic */}
        <div className="bg-gradient-to-br from-cyan-700 to-cyan-900 p-8 text-white relative">
          <div className="absolute right-6 top-6 bg-cyan-600/30 backdrop-blur-md h-12 w-12 rounded-xl flex items-center justify-center border border-white/10">
            <Shield className="h-6 w-6 text-cyan-200" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-200">Clinical Portal v1.0</span>
          <h2 className="text-2xl font-bold mt-2 font-sans tracking-tight">Echevaria Dental</h2>
          <p className="text-xs text-cyan-100/90 mt-1">Clinic Operations & Patient Ledger Gateway</p>
        </div>

        {/* Login Body */}
        <form onSubmit={handleLoginSubmit} className="p-8 space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select Authorized Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['dentist', 'staff'] as const).map(role => {
                const isActive = selectedRole === role;
                const isDentist = role === 'dentist';
                return (
                  <button
                    key={role}
                    type="button"
                    id={`login-role-btn-${role}`}
                    onClick={() => handleRoleChange(role)}
                    className={`flex flex-col items-start p-4 border rounded-xl transition-all cursor-pointer text-left h-[100px] justify-between
                      ${isActive
                        ? 'bg-cyan-50/50 border-cyan-600 ring-2 ring-cyan-500 ring-offset-1 text-cyan-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`h-6 w-6 rounded-xl flex items-center justify-center text-xs font-bold
                        ${isActive ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-400'}
                      `}>
                        {isDentist ? 'Dr' : 'St'}
                      </span>
                      {isActive && <CheckCircle2 className="h-4 w-4 text-cyan-600" />}
                    </div>
                    <div>
                      <span className="block text-sm font-bold capitalize leading-none mb-1">{role}</span>
                      <span className="block text-[10px] text-slate-500 leading-tight">
                        {isDentist ? 'Dr. Elena Reyes' : 'Marco Santos'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulated Username */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Authorized Email
            </label>
            <input
              type="text"
              readOnly
              value={selectedRole === 'dentist' ? 'elena.reyes@echevariadental.com' : 'marco.santos@echevariadental.com'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Secret Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-sm text-slate-800 font-mono tabular-nums focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            id="login-submit-btn"
            disabled={loading}
            className="w-full py-3 px-4 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></span>
                Verifying Credentials...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Sign In securely
              </span>
            )}
          </button>

          {/* Role Access Explanatory Helper Card */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2 text-slate-600 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
              <Shield className="h-3.5 w-3.5 text-slate-500" />
              Role Gating Definition (Asymmetric IA):
            </div>
            {selectedRole === 'dentist' ? (
              <p>
                <strong className="text-cyan-800">Dentist Access:</strong> Complete operations enabled. Full read/write clinical charting, treatment plan folders, completed procedures list, billing computations with Senior/PWD 20% discounts, and ledger tracking.
              </p>
            ) : (
              <p>
                <strong className="text-cyan-800">Staff Access:</strong> Restricted operations. Allows lookup by Name or Contact and view of last visit dates ONLY. Access to medical histories, allergies, odontograms, bills, and outstanding balances is blocked.
              </p>
            )}
          </div>

          {/* PH Data Privacy compliance footnote */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 justify-center">
            <FileLock2 className="h-3.5 w-3.5 text-slate-400" />
            PH Data Privacy Act (RA 10173) Compliant Gateway
          </div>
        </form>
      </motion.div>
    </div>
  );
};
