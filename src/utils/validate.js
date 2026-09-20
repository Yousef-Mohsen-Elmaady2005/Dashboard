const isValidUrl = (value) => {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

const checks = [
  {
    key: 'min',
    test: (value, rule) => value.length >= rule.min,
    message: (rule) => `The ${rule.label} must be at least ${rule.min} characters.`,
  },
  {
    key: 'noSpaces',
    test: (value) => !/\s/.test(value),
    message: (rule) => `The ${rule.label} must not contain spaces.`,
  },
  {
    key: 'email',
    test: (value) => /^\S+@\S+\.\S+$/.test(value),
    message: (rule) => `The ${rule.label} must be a valid email address.`,
  },
  {
    key: 'phone',
    test: (value) => /^\+?\d{10,15}$/.test(value.replace(/[\s-]/g, '')),
    message: (rule) => `The ${rule.label} must be a valid phone number.`,
  },
  {
    key: 'integer',
    test: (value) => /^-?\d+$/.test(value),
    message: (rule) => `The ${rule.label} must be a whole number.`,
  },
  {
    key: 'minValue',
    test: (value, rule) => Number(value) >= rule.minValue,
    message: (rule) => `The ${rule.label} must be at least ${rule.minValue}.`,
  },
  {
    key: 'url',
    test: (value) => isValidUrl(value),
    message: (rule) => `The ${rule.label} must be a valid URL.`,
  },
];

export const validate = (values, rules) => {
  const errors = [];

  for (const [field, rule] of Object.entries(rules)) {
    const value = String(values[field] ?? '').trim();

    if (!value) {
      if (rule.required) errors.push(`The ${rule.label} field is required.`);
      continue;
    }

    for (const check of checks) {
      if (rule[check.key] !== undefined && !check.test(value, rule)) {
        errors.push(check.message(rule));
      }
    }
  }

  return errors;
};

export const userRules = {
  name: { label: 'Name', required: true, min: 3 },
  email: { label: 'Email', required: true, email: true },
};

export const managerRules = {
  name: { label: 'Full Name', required: true, min: 3 },
  username: { label: 'Username', required: true, min: 3, noSpaces: true },
  email: { label: 'Email Address', required: true, email: true },
  phone: { label: 'Phone Number', required: true, phone: true },
  company: { label: 'Company', required: true, min: 2 },
  role: { label: 'Admin Role', required: true },
};

export const modelRules = {
  title: { label: 'Model Name', required: true, min: 3 },
  albumId: { label: 'Album ID', required: true, integer: true, minValue: 1 },
  url: { label: 'Image URL', required: true, url: true },
  thumbnailUrl: { label: 'Thumbnail URL', required: true, url: true },
};

export const contactRules = {
  name: { label: 'Name', required: true, min: 3 },
  email: { label: 'Email Address', required: true, email: true },
};
