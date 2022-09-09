import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from './components/SearchForm';

test('renders the search form', () => {
  render(
    <SearchForm onSubmit={ () => {}} />
  );
  const button = screen.getByText(/Calculate distances/i);
  expect(button).toBeInTheDocument();
});

test('shows all fields', () => {
  render(
    <SearchForm onSubmit={ () => {}} />
  );

  expect(screen.getByText('City of origin')).toBeInTheDocument();
  expect(screen.getByText('City of destination')).toBeInTheDocument();
  expect(screen.getByText('Date of the trip')).toBeInTheDocument();
  expect(screen.getByText('Number of passengers')).toBeInTheDocument();
});

test('shows "Add intermediate city" button', () => {
  render(
    <SearchForm onSubmit={ () => {}} />
  );
  expect(screen.getByText('Add intermediate city')).toBeInTheDocument();
});

test('user can add intermediate cities', () => {
  render(
    <SearchForm onSubmit={ () => {}} />
  );
  const button = screen.getByText('Add intermediate city');
  fireEvent.click(button)
  expect(screen.getByText('Intermediate city')).toBeInTheDocument();
});
