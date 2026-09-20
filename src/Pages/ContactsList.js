import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewedIds, setViewedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    api.get('/comments')
      .then(({ data }) => {
        if (isMounted) {
          setContacts(data.map(({ id, name, email }) => ({ id, name, email })));
        }
      })
      .catch(() => isMounted && setError('Unable to load contact messages.'))
      .finally(() => isMounted && setLoading(false));

    return () => { isMounted = false; };
  }, []);

  const allSelected = useMemo(
    () => contacts.length > 0 && selectedIds.length === contacts.length,
    [contacts, selectedIds],
  );

  const toggleSelected = (id) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id]);
  };

  const toggleAll = () => setSelectedIds(allSelected ? [] : contacts.map(({ id }) => id));

  const toggleViewed = (id) => {
    setViewedIds((current) => current.includes(id)
      ? current.filter((viewedId) => viewedId !== id)
      : [...current, id]);
  };

  const deleteContacts = async () => {
    const ids = deleteTarget.type === 'bulk' ? selectedIds : [deleteTarget.id];
    try {
      await Promise.all(ids.map((id) => api.delete(`/comments/${id}`)));
      setContacts((current) => current.filter((contact) => !ids.includes(contact.id)));
      setSelectedIds([]);
      setViewedIds((current) => current.filter((viewedId) => !ids.includes(viewedId)));
      setDeleteTarget(null);
    } catch {
      setError('Unable to delete the selected contact message.');
      setDeleteTarget(null);
    }
  };

  return (
    <section>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-800">Contact us</h1>
          <p className="mt-1 text-sm text-gray-500">View incoming contact messages.</p>
        </div>
        {selectedIds.length > 0 && (
          <button type="button" onClick={() => setDeleteTarget({ type: 'bulk' })} className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600">
            Delete selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        {loading && <p className="p-3 text-sm text-gray-500">جارٍ تحميل البيانات…</p>}
        {error && <p className="p-3 text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <table className="min-w-[620px] w-full text-sm">
            <thead className="border-b border-gray-100 text-gray-500">
              <tr className="text-left">
                <th className="w-16 p-3 text-center">
                  <input className="contact-checkbox" type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
                </th>
                <th className="p-3 font-normal">#</th>
                <th className="p-3 font-normal">Name</th>
                <th className="p-3 font-normal">Email</th>
                <th className="p-3 text-center font-normal">Viewed</th>
                <th className="p-3 text-center font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {contacts.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-gray-500">No contact messages found.</td></tr>
              ) : contacts.map((contact) => {
                const isViewed = viewedIds.includes(contact.id);
                return (
                  <tr key={contact.id} className="border-b border-gray-100 transition hover:bg-gray-50 last:border-0">
                    <td className="p-3 text-center">
                      <input className="contact-checkbox" type="checkbox" checked={selectedIds.includes(contact.id)} onChange={() => toggleSelected(contact.id)} aria-label={`Select ${contact.name}`} />
                    </td>
                    <td className="p-3 tabular-nums">{contact.id}</td>
                    <td className="p-3">{contact.name}</td>
                    <td className="p-3">{contact.email}</td>
                    <td className="p-3 text-center">
                      <button type="button" onClick={() => toggleViewed(contact.id)} className={`contact-switch ${isViewed ? 'contact-switch--on' : ''}`} role="switch" aria-checked={isViewed} aria-label={`Change viewed status for ${contact.name}`}>
                        <span />
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-3">
                        <button type="button" onClick={() => navigate(`/contacts/edit/${contact.id}`)} className="contact-action text-gray-400 hover:text-indigo-600" aria-label={`Edit ${contact.name}`} title="Edit">
                          <FontAwesomeIcon icon={faPen} size="sm" />
                        </button>
                        <button type="button" onClick={() => setDeleteTarget({ type: 'single', id: contact.id, name: contact.name })} className="contact-action text-gray-400 hover:text-rose-500" aria-label={`Delete ${contact.name}`} title="Delete">
                          <FontAwesomeIcon icon={faTrash} size="sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-contact-title">
          <div className="w-full max-w-xl rounded-xl bg-white px-4 py-6 text-center shadow-2xl sm:px-6 sm:py-8">
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-4 border-orange-300 text-5xl text-orange-300">
              <FontAwesomeIcon icon={faExclamation} />
            </div>
            <h2 id="delete-contact-title" className="mb-2 text-xl font-medium text-gray-700 sm:text-2xl">
              {deleteTarget.type === 'bulk'
                ? `Are you sure you want to delete ${selectedIds.length} contact messages?`
                : `Are you sure you want to delete the message from ${deleteTarget.name}?`}
            </h2>
            <p className="mb-8 text-base text-gray-400">This contact message cannot be recovered after deletion.</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={deleteContacts} className="rounded-lg bg-red-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-red-600">Yes, delete</button>
              <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-lg border-2 border-gray-200 bg-gray-50 px-8 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactsList;
