// Dark mode utility functions and classes for better text visibility

export const darkModeClasses = {
  // Text classes with better contrast
  textPrimary: "text-slate-900 dark:text-slate-100",
  textSecondary: "text-slate-600 dark:text-slate-300", 
  textMuted: "text-slate-500 dark:text-slate-400",
  textAccent: "text-blue-600 dark:text-blue-400",
  
  // Background classes
  bgCard: "bg-white dark:bg-slate-800",
  bgMuted: "bg-slate-50 dark:bg-slate-900",
  bgAccent: "bg-blue-50 dark:bg-blue-900/30",
  
  // Border classes
  borderDefault: "border-slate-200 dark:border-slate-700",
  borderMuted: "border-slate-100 dark:border-slate-800",
  
  // Shadow classes  
  shadowCard: "shadow-lg dark:shadow-slate-900/50",
  shadowLg: "shadow-xl dark:shadow-slate-900/50",
  
  // Gradient backgrounds for dark mode
  gradientCard: "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700",
  gradientMuted: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900",
  
  // Hover states
  hoverCard: "hover:bg-slate-50 dark:hover:bg-slate-700",
  hoverAccent: "hover:text-blue-700 dark:hover:text-blue-300",
};

export const getDarkModeClass = (lightClass: string, darkClass: string) => {
  return `${lightClass} dark:${darkClass}`;
};

// High contrast text utilities
export const highContrastText = {
  primary: "text-slate-950 dark:text-slate-50",
  secondary: "text-slate-700 dark:text-slate-200", 
  muted: "text-slate-600 dark:text-slate-300",
  accent: "text-blue-700 dark:text-blue-300",
};