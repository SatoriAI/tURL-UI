import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, setTheme, systemTheme } = useNextTheme();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return {
    theme: theme === 'system' ? systemTheme : theme,
    setTheme,
    toggleTheme,
  };
};