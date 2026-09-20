import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const ENDPOINT = 'https://jsonplaceholder.typicode.com/photos';

const ModelsList = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(ENDPOINT)
      .then(({ data }) => setModels(data.slice(0, 50)))
      .catch(() => setError('Unable to load models.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleModel = (id) => {
    setSelectedIds((current) => (
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    ));
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === models.length ? [] : models.map((model) => model.id));
  };

  const deleteModels = async () => {
    const ids = deleteTarget.type === 'bulk'
      ? selectedIds
      : [deleteTarget.model.id];

    try {
      await Promise.all(ids.map((id) => axios.delete(`${ENDPOINT}/${id}`)));
      setModels((current) => current.filter((model) => !ids.includes(model.id)));
      setSelectedIds([]);
      setDeleteTarget(null);
    } catch {
      setError('Unable to delete the model. Please try again.');
      setDeleteTarget(null);
    }
  };

  const isBulkDelete = deleteTarget?.type === 'bulk';
  const deleteTitle = isBulkDelete
    ? `Are you sure you want to delete ${selectedIds.length} models?`
    : `Are you sure you want to delete ${deleteTarget?.model.title}?`;

  return (
    <section>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Display Models</h1>
          <p className="mt-1 text-sm text-gray-500">Showing models from the API.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {selectedIds.length > 0 && <button type="button" onClick={() => setDeleteTarget({ type: 'bulk' })} className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"><FontAwesomeIcon icon={faTrash} size="sm" />Delete Selected ({selectedIds.length})</button>}
          <button type="button" onClick={() => navigate('/models/add')} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
            <FontAwesomeIcon icon={faPlus} size="sm" />
            Add New Model
          </button>
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="overflow-x-auto rounded-xl bg-white shadow">
        {loading ? <p className="p-4 text-sm text-gray-500">Loading models...</p> : (
          <table className="min-w-[620px] w-full text-sm">
            <thead><tr className="border-b text-left text-gray-500">
              <th className="p-3"><input type="checkbox" checked={models.length > 0 && selectedIds.length === models.length} onChange={toggleAll} aria-label="Select all models" /></th><th className="p-3 font-medium">#</th><th className="p-3 font-medium">PHOTO</th><th className="p-3 font-medium">MODEL NAME</th><th className="p-3 font-medium">ALBUM</th><th className="p-3 text-right font-medium">ACTIONS</th>
            </tr></thead>
            <tbody>
              {models.map((model) => <tr key={model.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" checked={selectedIds.includes(model.id)} onChange={() => toggleModel(model.id)} aria-label={`Select ${model.title}`} /></td>
                <td className="p-3 text-gray-500">{model.id}</td>
                <td className="p-3"><img src={model.thumbnailUrl} alt="" className="h-10 w-10 rounded-md object-cover" /></td>
                <td className="max-w-lg p-3 text-gray-800">{model.title}</td>
                <td className="p-3 text-gray-500">{model.albumId}</td>
                <td className="space-x-3 p-3 text-right">
                  <button type="button" onClick={() => navigate(`/models/edit/${model.id}`)} className="text-gray-400 transition hover:text-indigo-600" aria-label={`Edit ${model.title}`} title="Edit model"><FontAwesomeIcon icon={faPen} size="sm" /></button>
                  <button type="button" onClick={() => setDeleteTarget({ type: 'single', model })} className="text-gray-400 transition hover:text-red-600" aria-label={`Delete ${model.title}`} title="Delete model"><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                </td>
              </tr>)}
              {models.length === 0 && !error && <tr><td colSpan="6" className="p-6 text-center text-gray-500">No models found.</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {deleteTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-model-title">
        <div className="w-full max-w-xl rounded-xl bg-white px-4 py-6 text-center shadow-2xl sm:px-6 sm:py-8">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-4 border-orange-300 text-5xl text-orange-300"><FontAwesomeIcon icon={faExclamation} /></div>
          <h2 id="delete-model-title" className="mb-2 text-xl font-medium text-gray-700 sm:text-2xl">{deleteTitle}</h2>
          <p className="mb-8 text-base text-gray-400">This model cannot be recovered after deletion.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={deleteModels} className="rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 sm:px-8">Yes, delete</button><button type="button" onClick={() => setDeleteTarget(null)} className="rounded-lg border-2 border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 sm:px-8">Cancel</button></div>
        </div>
      </div>}
    </section>
  );
};

export default ModelsList;
