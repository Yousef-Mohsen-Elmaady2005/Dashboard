import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const rules = {
  name: { label: 'Name', required: true, min: 3 },
  email: { label: 'Email', required: true, email: true },
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

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => setForm({ name: response.data.name || '', email: response.data.email || '' }))
      .catch(() => setErrors(['Unable to load this user.']));
  }, [id]);

  const submit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (validationErrors.length) return;

    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, form);
      navigate('/users');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setErrors(
        apiErrors
          ? Object.values(apiErrors).flat()
          : ['Unable to update user. Please try again.']
      );
    }
  };

  return (
    <section className="max-w-lg">
      <h1 className="text-xl font-medium text-gray-800 mb-5">Edit user</h1>
      <form noValidate onSubmit={submit} className="bg-white rounded-xl p-5 space-y-4">
        {errors.length > 0 && (
          <div role="alert" className="space-y-1 rounded-md border border-red-200 bg-red-100 p-4 text-sm text-red-800">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
        <label className="block text-sm text-gray-700">
          Name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-200 p-2"
          />
        </label>
        <label className="block text-sm text-gray-700">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-200 p-2"
          />
        </label>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">Save changes</button>
      </form>
    </section>
  );
};

export default EditUser;