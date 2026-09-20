import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';

const initialForm = {
  name: '',
  username: '',
  email: '',
  phone: '',
  company: '',
  role: '',
  avatar: '',
};

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

const AddManager = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState([]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateAvatar = (event) => {
    const [file] = event.target.files;
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(['The Profile Picture must be a valid image file.']);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(['The Profile Picture must not be greater than 2MB.']);
      return;
    }

    setErrors([]);
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (validationErrors.length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      await axios.post('https://jsonplaceholder.typicode.com/users', {
        ...form,
        company: { name: form.company },
      });
      navigate('/managers');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setErrors(
        apiErrors
          ? Object.values(apiErrors).flat()
          : ['Unable to add the manager. Please try again.']
      );
    }
  };

  return (
    <section className="max-w-2xl">
      <h1 className="mb-5 text-xl font-semibold text-gray-800">Add New Manager</h1>
      <form noValidate onSubmit={submit} className="space-y-5 rounded-xl bg-white p-4 shadow sm:p-5">
        {errors.length > 0 && (
          <div role="alert" className="space-y-1 rounded-md border border-red-200 bg-red-100 p-4 text-sm text-red-800">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}
        <AvatarPicker value={form.avatar} onChange={updateAvatar} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" name="name" value={form.name} onChange={updateField} />
          <Field label="Username" name="username" value={form.username} onChange={updateField} />
          <Field label="Email Address" name="email" type="email" value={form.email} onChange={updateField} />
          <Field label="Phone Number" name="phone" value={form.phone} onChange={updateField} />
        </div>
        <Field label="Company" name="company" value={form.company} onChange={updateField} />
        <RoleSelect value={form.role} onChange={updateField} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto">Add Manager</button>
          <button type="button" onClick={() => navigate('/managers')} className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 sm:w-auto">Cancel</button>
        </div>
      </form>
    </section>
  );
};

const Field = ({ label, name, type = 'text', value, onChange }) => (
  <label className="block text-sm text-gray-700">
    {label}
    <input name={name} type={type} value={value} onChange={onChange} className="mt-1 w-full rounded-lg border border-gray-200 p-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
  </label>
);

export const RoleSelect = ({ value, onChange }) => (
  <label className="block text-sm font-medium text-gray-700">
    <span>Admin Role <span className="text-red-500">*</span></span>
    <select name="role" value={value} onChange={onChange} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
      <option value="" disabled>Select a role</option>
      <option value="admin">Admin</option>
      <option value="orders_manager">Orders Manager</option>
    </select>
  </label>
);

const AvatarPicker = ({ value, onChange }) => (
  <div>
    <p className="mb-2 text-sm font-medium text-gray-700">Profile Picture</p>
    <label className="group relative flex h-36 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-indigo-400 hover:bg-indigo-50">
      {value ? (
        <img src={value} alt="Profile preview" className="h-full w-full object-cover" />
      ) : (
        <span className="flex flex-col items-center gap-2 text-gray-400">
          <FontAwesomeIcon icon={faImage} className="text-3xl" />
          <span className="text-xs">Add a photo</span>
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-center bg-gray-900/85 text-white transition group-hover:bg-indigo-600">
        <FontAwesomeIcon icon={value ? faUser : faPlus} />
        <span className="ml-2 text-xs">{value ? 'Change photo' : 'Choose photo'}</span>
      </span>
      <input type="file" accept="image/*" onChange={onChange} className="sr-only" />
    </label>
  </div>
);

export default AddManager;
