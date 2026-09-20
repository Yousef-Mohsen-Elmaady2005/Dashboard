import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { validate, userRules } from '../utils/validate';

const fields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
];

const AddUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState([]);

  const submit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(form, userRules);
    setErrors(validationErrors);
    if (validationErrors.length) return;

    try {
      await api.post('/users', form);
      navigate('/users');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setErrors(
        apiErrors
          ? Object.values(apiErrors).flat()
          : ['Unable to add user. Please try again.']
      );
    }
  };

  return (
    <section className="max-w-lg">
      <h1 className="text-xl font-medium text-gray-800 mb-5">Add user</h1>
      <form noValidate onSubmit={submit} className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
        {errors.length > 0 && (
          <div role="alert" className="space-y-1 rounded-md border border-red-200 bg-red-100 p-4 text-sm text-red-800">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
        {fields.map((field) => (
          <label key={field.name} className="block text-sm text-gray-700">
            {field.label}
            <input
              type={field.type}
              value={form[field.name]}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-200 p-2"
            />
          </label>
        ))}
        <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 sm:w-auto">Save user</button>
      </form>
    </section>
  );
};

export default AddUser;
