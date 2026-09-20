import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { RoleSelect } from './AddManager';

const rules = {
  name: { label: 'Full Name', required: true, min: 3 },
  username: { label: 'Username', required: true, min: 3, noSpaces: true },
  email: { label: 'Email Address', required: true, email: true },
  phone: { label: 'Phone Number', required: true, phone: true },
  company: { label: 'Company', required: true, min: 2 },
  role: { label: 'Admin Role', required: true },
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
    if (rule.noSpaces && /\s/.test(value)) {
      errors.push(`The ${rule.label} must not contain spaces.`);
    }
    if (rule.email && !/^\S+@\S+\.\S+$/.test(value)) {
      errors.push(`The ${rule.label} must be a valid email address.`);
    }
    if (rule.phone && !/^\+?\d{10,15}$/.test(value.replace(/[\s-]/g, ''))) {
      errors.push(`The ${rule.label} must be a valid phone number.`);
    }
  }

  return errors;
};

const EditManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', phone: '', company: '', role: '' });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(({ data }) => setForm({
        name: data.name || '',
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        company: data.company?.name || '',
        role: data.role || '',
      }))
      .catch(() => setErrors(['Unable to load manager details.']))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (validationErrors.length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, {
        ...form,
        company: { name: form.company },
      });
      navigate('/managers');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setErrors(
        apiErrors
          ? Object.values(apiErrors).flat()
          : ['Unable to save changes. Please try again.']
      );
    }
  };

  if (loading) return <p>Loading manager details...</p>;

  return (
    <section className="max-w-2xl">
      <h1 className="mb-5 text-xl font-semibold text-gray-800">Edit Manager</h1>
      <form noValidate onSubmit={submit} className="space-y-4 rounded-xl bg-white p-5 shadow">
        {errors.length > 0 && (
          <div role="alert" className="space-y-1 rounded-md border border-red-200 bg-red-100 p-4 text-sm text-red-800">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" name="name" value={form.name} onChange={setForm} />
          <Field label="Username" name="username" value={form.username} onChange={setForm} />
          <Field label="Email Address" name="email" type="email" value={form.email} onChange={setForm} />
          <Field label="Phone Number" name="phone" value={form.phone} onChange={setForm} />
        </div>
        <Field label="Company" name="company" value={form.company} onChange={setForm} />
        <RoleSelect value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} />
        <div className="flex gap-3">
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">Save Changes</button>
          <button type="button" onClick={() => navigate('/managers')} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </section>
  );
};

const Field = ({ label, name, type = 'text', value, onChange }) => (
  <label className="block text-sm text-gray-700">
    {label}
    <input type={type} value={value} onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 p-2" />
  </label>
);

export default EditManager;