import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { validate, contactRules } from '../utils/validate';

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    api.get(`/comments/${id}`)
      .then(({ data }) => setForm({ name: data.name || '', email: data.email || '' }))
      .catch(() => setErrors(['Unable to load contact details.']))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(form, contactRules);
    setErrors(validationErrors);
    if (validationErrors.length) return;

    try {
      await api.put(`/comments/${id}`, form);
      navigate('/contacts');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setErrors(
        apiErrors
          ? Object.values(apiErrors).flat()
          : ['Unable to save changes. Please try again.']
      );
    }
  };

  if (loading) return <p>Loading contact details...</p>;

  return (
    <section className="max-w-2xl">
      <h1 className="mb-5 text-xl font-semibold text-gray-800">Edit Contact</h1>
      <form noValidate onSubmit={submit} className="space-y-4 rounded-xl bg-white p-4 shadow sm:p-5">
        {errors.length > 0 && (
          <div role="alert" className="space-y-1 rounded-md border border-red-200 bg-red-100 p-4 text-sm text-red-800">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
        <Field label="Name" name="name" value={form.name} type="text" onChange={setForm} />
        <Field label="Email Address" name="email" value={form.email} type="email" onChange={setForm} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 sm:w-auto">Save Changes</button>
          <button type="button" onClick={() => navigate('/contacts')} className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 sm:w-auto">Cancel</button>
        </div>
      </form>
    </section>
  );
};

const Field = ({ label, name, value, type, onChange }) => (
  <label className="block text-sm text-gray-700">
    {label}
    <input name={name} type={type} value={value} onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 p-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
  </label>
);

export default EditContact;
