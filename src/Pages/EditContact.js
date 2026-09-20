import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const rules = {
  name: { label: 'Name', required: true, min: 3 },
  email: { label: 'Email Address', required: true, email: true },
};

const validate = (values) => {
  const errors = [];

  for (const [field, rule] of Object.entries(rules)) {
    const value = (values[field] || '').trim();

    if (rule.required && !value) {
      errors.push(`The ${rule.label} field is required.`);
      continue;
    }
    if (rule.min && value.length < rule.min) {
      errors.push(`The ${rule.label} must be at least ${rule.min} characters.`);
    }
    if (rule.email && !/^\S+@\S+\.\S+$/.test(value)) {
      errors.push(`The ${rule.label} must be a valid email address.`);
    }
  }

  return errors;
};

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/comments/${id}`)
      .then(({ data }) => setForm({ name: data.name || '', email: data.email || '' }))
      .catch(() => setErrors(['Unable to load contact details.']))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (validationErrors.length) return;

    try {
      await axios.put(`https://jsonplaceholder.typicode.com/comments/${id}`, form);
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
      <form noValidate onSubmit={submit} className="space-y-4 rounded-xl bg-white p-5 shadow">
        {errors.length > 0 && (
          <div role="alert" className="space-y-1 rounded-md border border-red-200 bg-red-100 p-4 text-sm text-red-800">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
        <Field label="Name" name="name" value={form.name} type="text" onChange={setForm} />
        <Field label="Email Address" name="email" value={form.email} type="email" onChange={setForm} />
        <div className="flex gap-3">
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Save Changes</button>
          <button type="button" onClick={() => navigate('/contacts')} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
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