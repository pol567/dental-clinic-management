/**
 * Echevaria Dental Clinic Operations System
 * Design System - Motion and Snappy Transition Configurations
 * 
 * Rationale: Zero-latency tactile feedback takes absolute precedence in an enterprise system.
 * Animations are restricted to micro-interactions and quick fades.
 */
export const motionConfig = {
  // Snappy transition class names for tailwind element state modifications
  transitionFast: 'transition-all duration-75 ease-out',
  transitionNormal: 'transition-all duration-150 ease-in-out',
  transitionSlow: 'transition-all duration-300 ease-in-out',
  
  // Motion library-compatible object mappings (Framer / Motion)
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.1, ease: 'easeOut' }
  },
  
  slideUpSnappy: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
    transition: { duration: 0.12, ease: 'easeOut' }
  },
  
  slideLeftSnappy: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { type: 'spring', damping: 25, stiffness: 280 }
  }
};
export type MotionConfig = typeof motionConfig;
export default motionConfig;
