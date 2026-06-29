import { useTheme } from '../context/ThemeContext';

export default function ContrastToggle() {
  const { highContrast, toggleHighContrast } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={highContrast}
      onClick={toggleHighContrast}
      aria-label="Przełącz tryb wysokiego kontrastu"
      title="Tryb wysokiego kontrastu (WCAG 2.1)"
      className={[
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2',
        highContrast
          ? 'bg-black text-white border-black'
          : 'bg-white text-gray-700 border-gray-300 hover:border-pink-400',
      ].join(' ')}
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m0-18a9 9 0 110 18 9 9 0 010-18z" />
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
      </svg>
      <span className="hidden sm:inline">{highContrast ? 'Wysoki kontrast: WŁ.' : 'Wysoki kontrast'}</span>
    </button>
  );
}
