import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLightTheme = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold shadow-lg transition-colors"
      aria-label={`Switch to ${isLightTheme ? 'black' : 'white'} theme`}
      title={`Switch to ${isLightTheme ? 'black' : 'white'} theme`}
    >
      <span aria-hidden="true" className="text-base">
        {isLightTheme ? '☾' : '☀'}
      </span>
      <span>{isLightTheme ? 'Black' : 'White'}</span>
    </button>
  );
};

export default ThemeToggle;