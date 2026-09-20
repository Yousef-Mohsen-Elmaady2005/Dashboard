import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faEnvelope, faExclamation, faEye, faPen, faPhone, faPlus, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ManagersList = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((res) => setManagers(res.data.slice(0, 4)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedManagers = useMemo(
    () => managers.filter((manager) => selectedIds.includes(manager.id)),
    [managers, selectedIds],
  );

  const toggleManager = (id) => {
    setSelectedIds((current) => (
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    ));
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === managers.length ? [] : managers.map((manager) => manager.id));
  };

  const showDetails = async (manager) => {
    setDetails(manager);
    setDetailsLoading(true);
    try {
      const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/${manager.id}`);
      setDetails({ ...manager, ...data, avatar: manager.avatar });
    } catch {
      setError('Unable to load manager details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const deleteManagers = async () => {
    const ids = deleteTarget.type === 'bulk'
      ? selectedManagers.map((manager) => manager.id)
      : [deleteTarget.manager.id];

    try {
      await Promise.all(ids.map((id) => axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)));
      setManagers((current) => current.filter((manager) => !ids.includes(manager.id)));
      setSelectedIds([]);
      setDeleteTarget(null);
    } catch (err) {
      setError('Unable to delete the manager. Please try again.');
      setDeleteTarget(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error && managers.length === 0) return <p className="text-red-500">Error: {error}</p>;

  const isBulkDelete = deleteTarget?.type === 'bulk';
  const deleteTitle = isBulkDelete
    ? `Are you sure you want to delete ${selectedManagers.length} managers?`
    : `Are you sure you want to delete ${deleteTarget?.manager.name}?`;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">All Managers</h1>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setDeleteTarget({ type: 'bulk' })}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              <FontAwesomeIcon icon={faTrash} size="sm" />
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/managers/add')}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <FontAwesomeIcon icon={faPlus} size="sm" />
            Add Manager
          </button>
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">
                <input type="checkbox" checked={managers.length > 0 && selectedIds.length === managers.length} onChange={toggleAll} aria-label="Select all" />
              </th>
              <th className="p-3">#</th>
              <th className="p-3">PHOTO</th>
              <th className="p-3">NAME</th>
              <th className="p-3">USERNAME</th>
              <th className="p-3">EMAIL</th>
              <th className="p-3">PHONE</th>
              <th className="p-3">COMPANY</th>
              <th className="p-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {managers.length === 0 && (
              <tr><td colSpan="9" className="p-6 text-center text-gray-500">No managers found.</td></tr>
            )}
            {managers.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" checked={selectedIds.includes(m.id)} onChange={() => toggleManager(m.id)} aria-label={`Select ${m.name}`} /></td>
                <td className="p-3">{m.id}</td>
                <td className="p-3"><Avatar manager={m} size="h-9 w-9" /></td>
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.username}</td>
                <td className="p-3">{m.email}</td>
                <td className="p-3">{m.phone}</td>
                <td className="p-3">{m.company?.name}</td>
                <td className="space-x-3 p-3 text-right">
                  <button type="button" onClick={() => showDetails(m)} className="text-gray-400 transition hover:text-sky-600" aria-label={`View ${m.name} details`} title="View details">
                    <FontAwesomeIcon icon={faEye} size="sm" />
                  </button>
                  <button type="button" onClick={() => navigate(`/managers/edit/${m.id}`)} className="text-gray-400 transition hover:text-indigo-600" aria-label={`Edit ${m.name}`}>
                    <FontAwesomeIcon icon={faPen} size="sm" />
                  </button>
                  <button type="button" onClick={() => setDeleteTarget({ type: 'single', manager: m })} className="text-gray-400 transition hover:text-red-600" aria-label={`Delete ${m.name}`}>
                    <FontAwesomeIcon icon={faTrash} size="sm" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
          <div className="w-full max-w-xl rounded-xl bg-white px-6 py-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-4 border-orange-300 text-5xl text-orange-300">
              <FontAwesomeIcon icon={faExclamation} />
            </div>
            <h2 id="delete-dialog-title" className="mb-2 text-2xl font-medium text-gray-700">{deleteTitle}</h2>
            <p className="mb-8 text-base text-gray-400">This manager cannot be recovered after deletion.</p>
            <div className="flex justify-center gap-3">
              <button type="button" onClick={deleteManagers} className="rounded-lg bg-red-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-red-600">Yes, delete</button>
              <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-lg border-2 border-gray-200 bg-gray-50 px-8 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {details && (
        <ManagerDetails details={details} loading={detailsLoading} onClose={() => setDetails(null)} />
      )}
    </div>
  );
};

const Avatar = ({ manager, size = 'h-20 w-20' }) => (
  <div className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-indigo-500`}>
    {manager.avatar ? <img src={manager.avatar} alt="" className="h-full w-full object-cover" /> : <FontAwesomeIcon icon={faUser} />}
  </div>
);

const DetailRow = ({ icon, label, value, direction }) => (
  <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-indigo-500"><FontAwesomeIcon icon={icon} /></span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="truncate text-sm text-gray-800" dir={direction}>{value || '—'}</p>
    </div>
  </div>
);

const ManagerDetails = ({ details, loading, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="manager-details-title">
    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <button type="button" onClick={onClose} className="absolute right-4 top-3 text-2xl leading-none text-gray-400 transition hover:text-gray-700" aria-label="Close">×</button>
      <div className="mb-6 flex flex-col items-center text-center">
        <Avatar manager={details} size="h-20 w-20" />
        <h2 id="manager-details-title" className="mt-3 text-xl font-semibold text-gray-800">{details.name}</h2>
        <p className="text-sm text-gray-500">Manager ID {details.id}</p>
        <span className="mt-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">{details.role === 'orders_manager' ? 'Orders Manager' : details.role === 'admin' ? 'Admin' : 'Manager'}</span>
      </div>
      {loading ? <p className="py-8 text-center text-sm text-gray-500">Loading details...</p> : (
        <div className="space-y-3">
          <DetailRow icon={faEnvelope} label="Email Address" value={details.email} direction="ltr" />
          <DetailRow icon={faPhone} label="Phone Number" value={details.phone} direction="ltr" />
          <DetailRow icon={faUser} label="Username" value={details.username} direction="ltr" />
          <DetailRow icon={faBuilding} label="Company" value={details.company?.name || details.company} />
        </div>
      )}
    </div>
  </div>
);

export default ManagersList;
