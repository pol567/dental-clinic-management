'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/clinic-state';
import { SEED_USERS } from '@/lib/types';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { currentUser, setCurrentUser } = useClinic();
  const [selectedRole, setSelectedRole] = useState<'dentist' | 'staff'>(currentUser.role);
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

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
    <div id="login-screen-wrapper" className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8F7F5]">
      {/* Centered Login Card */}
      <div 
        id="login-card-container" 
        className="max-w-md w-full bg-white border border-border p-8 rounded flex flex-col"
      >
        {/* Branding & Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-11 w-11 bg-primary text-white flex items-center justify-center font-bold text-lg select-none rounded mb-3 leading-none">
            E
          </div>
          <h1 className="text-lg font-bold text-text-primary leading-none">Login</h1>
          <p className="text-xs text-text-muted mt-1.5 leading-none">Echevaria Dental Clinic Operations</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* Low-Profile Demo Role Selector Segmented Control */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Demo Authentication Domain
            </span>
            <div className="flex rounded bg-[#F1F5F9] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => handleRoleChange('dentist')}
                className={`flex-1 py-1.5 rounded font-medium text-center transition-all cursor-pointer ${
                  selectedRole === 'dentist'
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Dentist (Elena)
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('staff')}
                className={`flex-1 py-1.5 rounded font-medium text-center transition-all cursor-pointer ${
                  selectedRole === 'staff'
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Staff (Marco)
              </button>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="login-email-input" className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
              Your email*
            </label>
            <input
              type="email"
              id="login-email-input"
              readOnly
              value={selectedRole === 'dentist' ? 'elena.reyes@echevariadental.com' : 'marco.santos@echevariadental.com'}
              className="w-full bg-[#F8F7F5] border border-border rounded px-3 py-2 text-sm text-text-primary font-mono focus:outline-none h-11"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="login-password-input" className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => setCapsLockActive(e.getModifierState('CapsLock'))}
                onKeyDown={(e) => setCapsLockActive(e.getModifierState('CapsLock'))}
                className="w-full bg-white border border-border rounded pl-3 pr-10 py-2 text-sm text-text-primary font-mono tracking-wider focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all h-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Caps Lock Indicator */}
            {capsLockActive && (
              <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-bold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded mt-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-700" />
                Caps Lock is enabled
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px] cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></span>
                  Logging in...
                </span>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </div>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-6">
          <a href="#" className="text-xs text-primary hover:underline font-semibold transition-all">
            Forgot your password?
          </a>
        </div>
      </div>

      {/* Short PH Data Privacy compliance note */}
      <div className="text-center mt-8 text-[10px] text-text-muted max-w-xs mx-auto leading-relaxed border-t border-border/60 pt-4 flex items-center justify-center gap-1.5">
        <Shield className="h-3.5 w-3.5 text-text-muted" />
        Protected by Data Privacy Act (RA 10173)
      </div>
    </div>
  );
};
