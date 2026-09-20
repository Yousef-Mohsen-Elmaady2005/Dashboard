import { Link, useLocation } from 'react-router-dom';

const pageDetails = (pathname) => {
  if (pathname === '/') return { label: 'Dashboard', parent: null };

  const pages = [
    { prefix: '/contacts/edit/', label: 'Edit contact', parent: 'Contact us', parentPath: '/contacts' },
    { prefix: '/users/edit/', label: 'Edit user', parent: 'Users list', parentPath: '/users' },
    { prefix: '/users/add', label: 'Add user', parent: 'Users list', parentPath: '/users' },
    { prefix: '/users', label: 'Users list', parent: null },
    { prefix: '/managers/edit/', label: 'Edit manager', parent: 'All managers', parentPath: '/managers' },
    { prefix: '/managers/add', label: 'Add new manager', parent: 'All managers', parentPath: '/managers' },
    { prefix: '/managers', label: 'All managers', parent: null },
    { prefix: '/models/edit/', label: 'Edit model', parent: 'Display models', parentPath: '/models' },
    { prefix: '/models/add', label: 'Add new model', parent: 'Display models', parentPath: '/models' },
    { prefix: '/models', label: 'Display models', parent: null },
    { prefix: '/contacts', label: 'Contact us', parent: null },
  ];

  return pages.find(({ prefix }) => pathname.startsWith(prefix)) || { label: 'Page', parent: null };
};

const PageBreadcrumb = () => {
  const { pathname } = useLocation();
  const { label, parent, parentPath } = pageDetails(pathname);

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-3 text-lg" dir="ltr">
      <Link to="/" className="font-semibold text-gray-900 transition hover:text-indigo-600">
        Dashboard
      </Link>
      {pathname !== '/' && <span className="text-gray-400" aria-hidden="true">/</span>}
      {parent && (
        <>
          <Link to={parentPath} className="text-gray-500 transition hover:text-indigo-600">
            {parent}
          </Link>
          <span className="text-gray-400" aria-hidden="true">/</span>
        </>
      )}
      {pathname !== '/' && <span className="text-gray-500">{label}</span>}
    </nav>
  );
};

export default PageBreadcrumb;
