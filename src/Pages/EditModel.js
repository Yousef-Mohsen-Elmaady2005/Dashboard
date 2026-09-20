import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { validate, modelRules } from '../utils/validate';

const EditModel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', albumId: '', url: '', thumbnailUrl: '' });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    api.get(`/photos/${id}`)
      .then(({ data }) => setForm({
        title: data.title || '',
        albumId: data.albumId || '',
        url: data.url || '',
        thumbnailUrl: data.thumbnailUrl || '',
      }))
      .catch(() => setErrors(['Unable to load model details.']))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(form, modelRules);
    setErrors(validationErrors);
    if (validationErrors.length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      await api.put(`/photos/${id}`, {
        ...form,
        albumId: Number(form.albumId),
      });
      navigate('/models');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setErrors(
        apiErrors
          ? Object.values(apiErrors).flat()
          : ['Unable to save changes. Please try again.']
      );
    }
  };

  if (loading) return <p>Loading model details...</p>;

  return (
    <section className="max-w-2xl">
      <h1 className="mb-5 text-xl font-semibold text-gray-800">Edit Model</h1>
      <form noValidate onSubmit={submit} className="space-y-4 rounded-xl bg-white p-4 shadow sm:p-5">
        {errors.length > 0 && (
          <div role="alert" className="space-y-1 rounded-md border border-red-200 bg-red-100 p-4 text-sm text-red-800">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
        <Field label="Model Name" name="title" value={form.title} onChange={update} />
        <Field label="Album ID" name="albumId" type="number" min="1" value={form.albumId} onChange={update} />
        <Field label="Image URL" name="url" type="url" value={form.url} onChange={update} />
        <Field label="Thumbnail URL" name="thumbnailUrl" type="url" value={form.thumbnailUrl} onChange={update} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto">Save Changes</button>
          <button type="button" onClick={() => navigate('/models')} className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 sm:w-auto">Cancel</button>
        </div>
      </form>
    </section>
  );
};

const Field = ({ label, ...props }) => (
  <label className="block text-sm text-gray-700">
    {label}
    <input {...props} className="mt-1 w-full rounded-lg border border-gray-200 p-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
  </label>
);

export default EditModel;
