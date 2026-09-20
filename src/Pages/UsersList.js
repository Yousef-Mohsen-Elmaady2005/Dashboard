// src/pages/UsersList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPlus, faExclamation } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (error) {
      setError('Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (id) => {
    setSelectedIds((current) => (
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    ));
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === users.length ? [] : users.map((user) => user.id));
  };

  const handleDelete = async () => {
    const ids = deleteTarget.type === 'bulk'
      ? selectedIds
      : [deleteTarget.user.id];

    try {
      await Promise.all(ids.map((id) => axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)));
      setUsers((prev) => prev.filter((user) => !ids.includes(user.id)));
      setSelectedIds([]);
      setDeleteTarget(null);
    } catch (error) {
      setError('Unable to delete the selected user(s).');
    }
  };

  const initials = (name) =>
    name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-800 mb-1">Users list</h1>
          <p className="text-sm text-gray-500">GET request from the API.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setDeleteTarget({ type: 'bulk' })}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm text-white transition hover:bg-red-600 sm:px-4"
            >
              <FontAwesomeIcon icon={faTrash} size="sm" />
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => navigate('/users/add')}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white transition hover:bg-indigo-700 sm:px-4"
          >
            <FontAwesomeIcon icon={faPlus} size="sm" />
            Add user
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        {error && <p className="p-3 text-sm text-red-600">{error}</p>}
        {loading && <p className="p-3 text-sm text-gray-500">Loading users…</p>}
        <table className="min-w-[560px] w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={users.length > 0 && selectedIds.length === users.length}
                  onChange={toggleAll}
                  aria-label="Select all users"
                />
              </th>
              <th className="p-3 font-normal">Name</th>
              <th className="p-3 font-normal">Email</th>
              <th className="p-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !error && users.length === 0 && (
              <tr><td colSpan="4" className="p-6 text-center text-gray-500">No users found.</td></tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 last:border-0">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                    aria-label={`Select ${user.name}`}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium">
                      {initials(user.name)}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td className="p-3 text-gray-500">{user.email}</td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => navigate(`/users/edit/${user.id}`)}
                    className="text-gray-400 hover:text-indigo-600"
                  >
                    <FontAwesomeIcon icon={faPen} size="sm" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'single', user })}
                    className="text-gray-400 hover:text-red-600"
                    aria-label={`Delete ${user.name}`}
                  >
                    <FontAwesomeIcon icon={faTrash} size="sm" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="w-full max-w-xl rounded-xl bg-white px-4 py-6 text-center shadow-2xl sm:px-6 sm:py-8">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-4 border-orange-300 text-5xl text-orange-300">
              <FontAwesomeIcon icon={faExclamation} />
            </div>
            <h2 id="delete-dialog-title" className="mb-2 text-xl font-medium text-gray-700 sm:text-2xl">
              {deleteTarget.type === 'bulk'
                ? `Are you sure you want to delete ${selectedIds.length} users?`
                : `Are you sure you want to delete ${deleteTarget.user.name}?`}
            </h2>
            <p className="mb-8 text-base text-gray-400">
              This user cannot be recovered after deletion.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 sm:px-8"
              >
                Yes, delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border-2 border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 sm:px-8"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
