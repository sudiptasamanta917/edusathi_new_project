import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/src/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg transition-colors ${
            theme === 'light' 
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg transition-colors ${
            theme === 'system' 
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}