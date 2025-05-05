import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 hover:scale-105 transition-transform duration-200 shadow-md"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '☀️' :'🌙'}
    </button>
  );
};

export default ThemeToggle;