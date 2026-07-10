'use client';

import React, { forwardRef } from 'react';
import { useDesignSystem } from './context';
import { Loader2 } from 'lucide-react';

// ============================================================================
// 1. BUTTON
// ============================================================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'critical';
  size?: 'sm' | 'md' | 'lg' | 'auto';
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className = '',
  variant = 'primary',
  size = 'auto',
  isLoading = false,
  startIcon,
  endIcon,
  children,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  const { colors: c, radius: r, spacing: s, motion: m } = useDesignSystem();

  // Variant styles mapping
  const variantClasses = {
    primary: `${c.primary}`,
    secondary: `${c.secondary}`,
    outline: `bg-transparent border ${c.border} text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100`,
    ghost: `bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200`,
    critical: `${c.critical}`,
  };

  // Size classes override
  const sizeClasses = {
    sm: 'h-8 px-3 text-[11px]',
    md: 'h-10 px-4 text-xs',
    lg: 'h-12 px-6 text-sm',
    auto: `${s.height.button}`, // derives automatically from the active density token
  };

  const isBtnDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isBtnDisabled}
      className={`
        inline-flex items-center justify-center font-semibold select-none cursor-pointer
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${r.xl}
        ${m.transitionFast}
        ${isBtnDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5 shrink-0" />}
      {!isLoading && startIcon && <span className="mr-1.5 inline-flex shrink-0">{startIcon}</span>}
      <span className="truncate">{children}</span>
      {!isLoading && endIcon && <span className="ml-1.5 inline-flex shrink-0">{endIcon}</span>}
    </button>
  );
});
Button.displayName = 'Button';

// ============================================================================
// 2. ICON BUTTON
// ============================================================================
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'critical';
  size?: 'sm' | 'md' | 'lg' | 'auto';
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  className = '',
  variant = 'ghost',
  size = 'auto',
  isLoading = false,
  children,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  const { colors: c, radius: r, spacing: s, motion: m } = useDesignSystem();

  const variantClasses = {
    primary: `${c.primary}`,
    secondary: `${c.secondary}`,
    outline: `bg-transparent border ${c.border} text-slate-600 hover:bg-slate-50 hover:text-slate-900`,
    ghost: `bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900`,
    critical: `${c.critical}`,
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    auto: `${s.height.button} w-${s.height.button.split('-')[1]}`, // matching height and square width
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center shrink-0 cursor-pointer
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${r.xl}
        ${m.transitionFast}
        ${disabled || isLoading ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
});
IconButton.displayName = 'IconButton';

// ============================================================================
// 3. INPUT
// ============================================================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  label,
  error,
  startIcon,
  endIcon,
  id,
  type = 'text',
  ...props
}, ref) => {
  const { colors: c, radius: r, spacing: s, typography: t } = useDesignSystem();

  return (
    <div className="w-full space-y-1 text-left">
      {label && (
        <label htmlFor={id} className={`block font-bold text-slate-500 uppercase tracking-wider text-[10px]`}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {startIcon && (
          <span className="absolute left-3 text-slate-400 shrink-0 pointer-events-none">
            {startIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={`
            w-full border font-semibold text-slate-800 bg-white placeholder-slate-400
            ${s.padding.input}
            ${s.height.input}
            ${r.xl}
            ${startIcon ? 'pl-9' : ''}
            ${endIcon ? 'pr-9' : ''}
            ${error ? 'border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-200' : `${c.border} ${c.borderFocus}`}
            ${className}
          `}
          {...props}
        />
        {endIcon && (
          <span className="absolute right-3 text-slate-400 shrink-0 pointer-events-none">
            {endIcon}
          </span>
        )}
      </div>
      {error && <p className="text-[10px] text-rose-600 font-bold tracking-wide mt-1">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';

// ============================================================================
// 4. TEXTAREA
// ============================================================================
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className = '',
  label,
  error,
  id,
  rows = 3,
  ...props
}, ref) => {
  const { colors: c, radius: r, spacing: s } = useDesignSystem();

  return (
    <div className="w-full space-y-1 text-left">
      {label && (
        <label htmlFor={id} className="block font-bold text-slate-500 uppercase tracking-wider text-[10px]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={`
          w-full border font-semibold text-slate-800 bg-white placeholder-slate-400 resize-none
          ${s.padding.input}
          ${r.xl}
          ${error ? 'border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-200' : `${c.border} ${c.borderFocus}`}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-600 font-bold tracking-wide mt-1">{error}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';

// ============================================================================
// 5. SELECT
// ============================================================================
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className = '',
  label,
  error,
  options = [],
  id,
  children,
  ...props
}, ref) => {
  const { colors: c, radius: r, spacing: s } = useDesignSystem();

  return (
    <div className="w-full space-y-1 text-left">
      {label && (
        <label htmlFor={id} className="block font-bold text-slate-500 uppercase tracking-wider text-[10px]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`
          w-full border font-semibold text-slate-800 bg-white pr-8 appearance-none cursor-pointer
          ${s.padding.input}
          ${s.height.input}
          ${r.xl}
          ${error ? 'border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-200' : `${c.border} ${c.borderFocus}`}
          ${className}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='none' stroke='%2364748B' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
          backgroundRepeat: 'no-repeat',
        }}
        {...props}
      >
        {children || options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] text-rose-600 font-bold tracking-wide mt-1">{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';

// ============================================================================
// 6. CHECKBOX
// ============================================================================
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  className = '',
  label,
  description,
  id,
  ...props
}, ref) => {
  const { colors: c, radius: r } = useDesignSystem();

  return (
    <div className="flex items-start gap-2.5 text-left">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={`
            h-4 w-4 text-cyan-700 bg-white border-slate-300 rounded-none focus:ring-cyan-600/30 cursor-pointer
            ${className}
          `}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="flex flex-col select-none">
          <label htmlFor={id} className="text-xs font-semibold text-slate-800 cursor-pointer">
            {label}
          </label>
          {description && (
            <p className="text-[10px] text-slate-400 font-semibold leading-normal">{description}</p>
          )}
        </div>
      )}
    </div>
  );
});
Checkbox.displayName = 'Checkbox';

// ============================================================================
// 7. BADGE
// ============================================================================
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'critical' | 'info' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'neutral',
  children,
  ...props
}) => {
  const { radius: r } = useDesignSystem();

  const variantClasses = {
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200/60',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/50',
    critical: 'bg-rose-50 text-rose-700 border border-rose-200/50',
    info: 'bg-sky-50 text-sky-700 border border-sky-200/50',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wide uppercase select-none
        ${variantClasses[variant]}
        ${r.full}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

// ============================================================================
// 8. ALERT
// ============================================================================
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  severity?: 'success' | 'warning' | 'critical' | 'info';
  title?: string;
  icon?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  className = '',
  severity = 'info',
  title,
  icon,
  children,
  ...props
}) => {
  const { radius: r, spacing: s } = useDesignSystem();

  const variantClasses = {
    success: 'bg-emerald-50/85 border border-emerald-200/60 text-emerald-800',
    warning: 'bg-amber-50/85 border border-amber-200/60 text-amber-800',
    critical: 'bg-rose-50/85 border border-rose-200/80 text-rose-800',
    info: 'bg-sky-50/85 border border-sky-200/60 text-sky-800',
  };

  return (
    <div
      className={`
        flex gap-3 text-left
        ${variantClasses[severity]}
        ${s.padding.card}
        ${r.xxl}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="mt-0.5 shrink-0 inline-flex">{icon}</span>}
      <div className="space-y-1 flex-1">
        {title && (
          <h4 className="text-xs font-bold leading-none tracking-tight">
            {title}
          </h4>
        )}
        {children && <div className="text-[11px] font-semibold leading-relaxed opacity-90">{children}</div>}
      </div>
    </div>
  );
};

// ============================================================================
// 9. PANEL & CARD
// ============================================================================
export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'bordered' | 'shaded';
  scrollable?: boolean;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(({
  className = '',
  variant = 'flat',
  scrollable = false,
  children,
  ...props
}, ref) => {
  const { colors: c, radius: r } = useDesignSystem();

  const variantClasses = {
    flat: 'bg-white',
    shaded: 'bg-slate-50/60',
    bordered: `bg-white border ${c.border}`,
  };

  return (
    <div
      ref={ref}
      className={`
        flex flex-col
        ${variantClasses[variant]}
        ${r.xxl}
        ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});
Panel.displayName = 'Panel';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => {
  const { colors: c, radius: r, spacing: s, shadows: sh } = useDesignSystem();
  return (
    <div
      className={`
        bg-white border border-slate-200/60
        ${s.padding.card}
        ${r.xxl}
        ${sh.sm}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// 10. DIVIDER
// ============================================================================
export const Divider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...props
}) => {
  return (
    <div
      className={`h-px w-full bg-slate-200/60 shrink-0 ${className}`}
      {...props}
    />
  );
};

// ============================================================================
// 11. TOOLBAR
// ============================================================================
export const Toolbar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => {
  const { spacing: s } = useDesignSystem();
  return (
    <div
      className={`
        flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 border border-slate-200/50 p-2.5 rounded-none
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// 12. EMPTY STATE
// ============================================================================
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className = '',
  title,
  description,
  icon,
  action,
  ...props
}) => {
  const { radius: r, spacing: s } = useDesignSystem();
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center p-8 border border-solid border-slate-200/80 bg-slate-50/20
        ${r.xxl}
        ${className}
      `}
      {...props}
    >
      {icon && <div className="text-slate-400 mb-3 shrink-0">{icon}</div>}
      <h3 className="text-xs font-bold text-slate-700 tracking-tight mb-1">{title}</h3>
      {description && <p className="text-[11px] text-slate-400 font-semibold max-w-sm leading-relaxed mb-4">{description}</p>}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

// ============================================================================
// 13. LOADING STATE & SKELETON
// ============================================================================
export const LoadingState: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex items-center justify-center py-12 px-4 gap-2 text-xs font-semibold text-slate-500 ${className}`}
      {...props}
    >
      <Loader2 className="h-4 w-4 animate-spin text-cyan-700 shrink-0" />
      Syncing workspace logs...
    </div>
  );
};

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement> & { variant?: 'text' | 'rect' | 'circle' }> = ({
  className = '',
  variant = 'rect',
  ...props
}) => {
  const { radius: r } = useDesignSystem();

  const variantClasses = {
    text: 'h-3.5 w-full rounded-none',
    rect: 'h-10 w-full',
    circle: 'h-10 w-10 rounded-full',
  };

  return (
    <div
      className={`
        bg-slate-100/80 animate-pulse
        ${variantClasses[variant]}
        ${variant === 'rect' ? r.lg : ''}
        ${className}
      `}
      {...props}
    />
  );
};

// ============================================================================
// 14. SIMPLE TOOLTIP
// ============================================================================
export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top'
}) => {
  const [show, setShow] = React.useState(false);
  const { radius: r, shadows: sh } = useDesignSystem();

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`
            absolute pointer-events-none whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 z-50 transition-opacity
            ${r.md}
            ${positionClasses[position]}
            ${sh.md}
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
};
