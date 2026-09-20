import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
    isActive
      ? 'bg-white/10 text-white font-semibold'
      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
  }`;

const SidebarGroup = ({ label, icon, basePath, items, spaced = false, onNavigate }) => {
  const { pathname } = useLocation();
  const isActive = pathname.startsWith(basePath);
  const [open, setOpen] = useState(isActive);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={`${spaced ? 'mt-2 ' : ''}flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
          isActive
            ? 'bg-white/10 text-white font-semibold'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
      >
        <span className="flex items-center gap-3">
          <FontAwesomeIcon icon={icon} size="sm" />
          {label}
        </span>
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} size="xs" />
      </button>

      {open && (
        <div className="flex flex-col gap-1 pl-4">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onNavigate}>
              <FontAwesomeIcon icon={item.icon} size="xs" />
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
};

export default SidebarGroup;
