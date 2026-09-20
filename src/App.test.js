import { render, screen } from '@testing-library/react';
import Dashboard from './Pages/Dashboard';

test('renders the dashboard', () => {
  render(<Dashboard />);
  expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
});
