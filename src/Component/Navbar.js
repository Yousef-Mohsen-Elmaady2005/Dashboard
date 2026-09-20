import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableCellsLarge,
  faHouse,
  faUsers,
  faUserGear,
  faCar,
  faChevronUp,
  faChevronDown,
  faCircle,
  faPlus,
  faComments,
} from '@fortawesome/free-solid-svg-icons';

const navItems = [
  { to: '/', label: 'Dashboard', icon: faHouse, end: true },
];

const userItems = [
  { to: '/users', label: 'Users list', icon: faCircle },
  { to: '/users/add', label: 'Add user', icon: faPlus },
];

const managerItems = [
  { to: '/managers', label: ' Show all data ', icon: faCircle },
  { to: '/managers/add', label: 'Add new manager', icon: faPlus },
];

const modelItems = [
  { to: '/models', label: 'Display Models', icon: faCircle },
  { to: '/models/add', label: 'Add New Model', icon: faPlus },
];

const contactItems = [
  { to: '/contacts', label: 'Show all data', icon: faCircle },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
    isActive
      ? 'bg-white/10 text-white font-semibold'
      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
  }`;

const Sidebar = () => {
  const location = useLocation();
  const isUsersActive = location.pathname.startsWith('/users');
  const isManagersActive = location.pathname.startsWith('/managers');
  const isModelsActive = location.pathname.startsWith('/models');
  const isContactsActive = location.pathname.startsWith('/contacts');
  const [usersOpen, setUsersOpen] = useState(isUsersActive);
  const [managersOpen, setManagersOpen] = useState(isManagersActive);
  const [modelsOpen, setModelsOpen] = useState(isModelsActive);
  const [contactsOpen, setContactsOpen] = useState(isContactsActive);

  return (
    <aside className="fixed bottom-0 left-0 top-[70px] z-40 flex w-56 flex-col gap-1 overflow-y-auto bg-[#0d0d0f] p-4">
      <div className="flex items-center gap-3 px-2 pb-6">
        <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
          <FontAwesomeIcon icon={faTableCellsLarge} size="sm" />
        </div>
        <span className="font-semibold text-white text-[15px]">Userbase</span>
      </div>

      {navItems.map((item) => (
        <NavLink key={item.label} to={item.to} end={item.end} className={linkClass}>
          <FontAwesomeIcon icon={item.icon} size="sm" />
          {item.label}
        </NavLink>
      ))}

      <button
        type="button"
        onClick={() => setUsersOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
          isUsersActive
            ? 'bg-white/10 text-white font-semibold'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
      >
        <span className="flex items-center gap-3">
          <FontAwesomeIcon icon={faUsers} size="sm" />
          Users
        </span>
        <FontAwesomeIcon icon={usersOpen ? faChevronUp : faChevronDown} size="xs" />
      </button>

      {usersOpen && (
        <div className="flex flex-col gap-1 pl-4">
          {userItems.map((item) => (
            <NavLink key={item.label} to={item.to} className={linkClass}>
              <FontAwesomeIcon icon={item.icon} size="xs" />
              {item.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Managers group */}
      <button
        type="button"
        onClick={() => setManagersOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
          isManagersActive
            ? 'bg-white/10 text-white font-semibold'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
      >
        <span className="flex items-center gap-3">
          <FontAwesomeIcon icon={faUserGear} size="sm" />
          Managers
        </span>
        <FontAwesomeIcon icon={managersOpen ? faChevronUp : faChevronDown} size="xs" />
      </button>

      {managersOpen && (
        <div className="flex flex-col gap-1 pl-4">
          {managerItems.map((item) => (
            <NavLink key={item.label} to={item.to} className={linkClass}>
              <FontAwesomeIcon icon={item.icon} size="xs" />
              {item.label}
            </NavLink>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setModelsOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
          isModelsActive
            ? 'bg-white/10 text-white font-semibold'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
      >
        <span className="flex items-center gap-3">
          <FontAwesomeIcon icon={faCar} size="sm" />
          Models
        </span>
        <FontAwesomeIcon icon={modelsOpen ? faChevronUp : faChevronDown} size="xs" />
      </button>

      {modelsOpen && (
        <div className="flex flex-col gap-1 pl-4">
          {modelItems.map((item) => (
            <NavLink key={item.label} to={item.to} className={linkClass}>
              <FontAwesomeIcon icon={item.icon} size="xs" />
              {item.label}
            </NavLink>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setContactsOpen((prev) => !prev)}
        className={`mt-2 flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
          isContactsActive
            ? 'bg-white/10 text-white font-semibold'
            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
      >
        <span className="flex items-center gap-3">
          <FontAwesomeIcon icon={faComments} size="sm" />
          Contact us
        </span>
        <FontAwesomeIcon icon={contactsOpen ? faChevronUp : faChevronDown} size="xs" />
      </button>

      {contactsOpen && (
        <div className="flex flex-col gap-1 pl-4">
          {contactItems.map((item) => (
            <NavLink key={item.label} to={item.to} className={linkClass}>
              <FontAwesomeIcon icon={item.icon} size="xs" />
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
