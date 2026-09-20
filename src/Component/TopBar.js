import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCalendarDays,
  faClock,
  faLanguage,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

const formatTime = (date) =>
  new Intl.DateTimeFormat('ar-EG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .replace(/\u200f|\u200e/g, '');

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

const TopBar = ({ onMenuToggle }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[70px] border-y border-[#d7d7d7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex h-full items-center gap-3 px-4 text-[#14213d] sm:gap-5 sm:px-6" dir="ltr">
        <button type="button" onClick={onMenuToggle} aria-label="Open navigation menu" className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-colors hover:bg-gray-100 hover:text-indigo-600 lg:hidden">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-9 w-6 items-center justify-center text-xl transition-colors hover:text-indigo-600"
        >
          <FontAwesomeIcon icon={faBell} />
          <span className="absolute -right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded bg-[#1f2937] px-1 text-[10px] font-bold leading-none text-white">
            0
          </span>
        </button>

        <button type="button" className="inline-flex items-center gap-2 text-base hover:text-indigo-600 sm:text-lg" aria-label="Change language">
          <span>EN</span>
          <FontAwesomeIcon icon={faLanguage} className="text-base" />
        </button>

        <div className="hidden items-center gap-1.5 text-base sm:inline-flex" dir="rtl">
          <FontAwesomeIcon icon={faClock} />
          <span>{formatTime(now)}</span>
        </div>

        <div className="hidden items-center gap-1.5 text-base md:inline-flex">
          <span>{formatDate(now)}</span>
          <FontAwesomeIcon icon={faCalendarDays} />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
