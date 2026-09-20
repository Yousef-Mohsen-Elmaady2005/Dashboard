import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faComments,
  faCubes,
  faUserShield,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, managers: 0, models: 0, contacts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      api.get('/users'),
      api.get('/photos'),
      api.get('/comments'),
    ])
      .then(([usersResponse, modelsResponse, contactsResponse]) => {
        if (!isMounted) return;

        setStats({
          users: usersResponse.data.length,
          managers: usersResponse.data.slice(0, 4).length,
          models: modelsResponse.data.slice(0, 50).length,
          contacts: contactsResponse.data.length,
        });
      })
      .catch(() => isMounted && setError(true))
      .finally(() => isMounted && setLoading(false));

    return () => { isMounted = false; };
  }, []);

  const totalRecords = useMemo(
    () => Object.values(stats).reduce((total, count) => total + count, 0),
    [stats],
  );

  const cards = [
    { label: 'Total users', value: stats.users, icon: faUsers, to: '/users', color: 'indigo', description: 'Registered user accounts' },
    { label: 'Managers', value: stats.managers, icon: faUserShield, to: '/managers', color: 'sky', description: 'Team managers' },
    { label: 'Display models', value: stats.models, icon: faCubes, to: '/models', color: 'violet', description: 'Models in the catalogue' },
    { label: 'Contact messages', value: stats.contacts, icon: faComments, to: '/contacts', color: 'emerald', description: 'Incoming customer messages' },
  ];

  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600',
    sky: 'bg-sky-50 text-sky-600 group-hover:bg-sky-600',
    violet: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600',
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600',
  };

  return (
    <section className="max-w-6xl">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">A quick overview of everything you manage.</p>
        </div>
        <div className="rounded-lg bg-white px-4 py-3 text-right shadow-sm ring-1 ring-gray-100">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">All records</p>
          <p className="mt-0.5 text-xl font-semibold text-gray-800">{loading ? '…' : totalRecords}</p>
        </div>
      </div>

      {error && <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">Some dashboard statistics could not be loaded. Please try again.</p>}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-5 flex items-start justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${colorClasses[card.color]}`}>
                <FontAwesomeIcon icon={card.icon} className="transition-colors group-hover:text-white" />
              </span>
              <FontAwesomeIcon icon={faArrowRight} className="mt-1 text-xs text-gray-300 transition group-hover:translate-x-1 group-hover:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-800">{loading ? '…' : card.value}</p>
            <p className="mt-2 text-xs text-gray-400">{card.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-7 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Records summary</h2>
        <p className="mt-1 text-sm text-gray-500">Your current data across every dashboard section.</p>
        <div className="mt-5 space-y-4">
          {cards.map((card) => {
            const share = totalRecords ? Math.round((card.value / totalRecords) * 100) : 0;
            const barColor = card.color === 'emerald' ? 'bg-emerald-500' : card.color === 'sky' ? 'bg-sky-500' : card.color === 'violet' ? 'bg-violet-500' : 'bg-indigo-500';
            return (
              <div key={card.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-gray-600">{card.label}</span>
                  <span className="font-medium text-gray-800">{loading ? '…' : `${card.value} (${share}%)`}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${barColor}`} style={{ width: `${loading ? 0 : share}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
