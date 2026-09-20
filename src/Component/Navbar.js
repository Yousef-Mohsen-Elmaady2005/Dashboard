import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableCellsLarge,
  faHouse,
  faUsers,
  faUserGear,
  faCar,
  faCircle,
  faPlus,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import SidebarGroup, { linkClass } from './SidebarGroup';

const navItems = [
  { to: '/', label: 'Dashboard', icon: faHouse, end: true },
];

const groups = [
  {
    label: 'Users',
    icon: faUsers,
    basePath: '/users',
    items: [
      { to: '/users', label: 'Users list', icon: faCircle },
      { to: '/users/add', label: 'Add user', icon: faPlus },
    ],
  },
  {
    label: 'Managers',
    icon: faUserGear,
    basePath: '/managers',
    items: [
      { to: '/managers', label: 'Show all data', icon: faCircle },
      { to: '/managers/add', label: 'Add new manager', icon: faPlus },
    ],
  },
  {
    label: 'Models',
    icon: faCar,
    basePath: '/models',
    items: [
      { to: '/models', label: 'Display Models', icon: faCircle },
      { to: '/models/add', label: 'Add New Model', icon: faPlus },
    ],
  },
  {
    label: 'Contact us',
    icon: faComments,
    basePath: '/contacts',
    spaced: true,
    items: [
      { to: '/contacts', label: 'Show all data', icon: faCircle },
    ],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const closeOnMobile = () => {
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside className={`fixed bottom-0 left-0 top-[70px] z-40 flex w-64 -translate-x-full flex-col gap-1 overflow-y-auto bg-[#0d0d0f] p-4 shadow-xl transition-transform duration-200 lg:w-56 lg:translate-x-0 lg:shadow-none ${isOpen ? 'translate-x-0' : ''}`}>
        <div className="flex items-center gap-3 px-2 pb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
            <FontAwesomeIcon icon={faTableCellsLarge} size="sm" />
          </div>
          <span className="font-semibold text-white text-[15px]">Userbase</span>
        </div>

        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={closeOnMobile}>
            <FontAwesomeIcon icon={item.icon} size="sm" />
            {item.label}
          </NavLink>
        ))}

        {groups.map((group) => (
          <SidebarGroup key={group.basePath} {...group} onNavigate={closeOnMobile} />
        ))}
      </aside>
    </>
  );
};

export default Sidebar;
