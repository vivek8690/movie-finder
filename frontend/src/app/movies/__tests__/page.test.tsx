import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MoviesPage from '../page'; // Adjust path as necessary
import type { Movie } from '@/types';

// Mock fetch
global.fetch = jest.fn();

const mockMovies: Movie[] = [
  { _id: '1', name: 'Inception', genre: 'Sci-Fi', director: 'Christopher Nolan', popularity: 98, imdb_score: 8.8 },
  { _id: '2', name: 'The Matrix', genre: 'Sci-Fi', director: 'Wachowskis', popularity: 95, imdb_score: 8.7 },
];

describe('MoviesPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders movie names from fetched data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovies,
    });

    // Next.js Server Components are async, so we await the component directly
    // When testing Server Components that fetch data, React Testing Library's `render`
    // will typically wait for the initial render cycle, including async operations.
    // However, since `MoviesPage` is an async function itself, we need to await its rendering.
    // RPT requires JSX element to be passed to render
    const Page = await MoviesPage();
    render(Page);

    // Check for movie names
    // Using waitFor to handle potential async updates if any were still pending, though often not needed for simple text
    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });
    expect(screen.getByText('The Matrix')).toBeInTheDocument();

    // Verify fetch was called
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/movies', { cache: 'no-store' });
  });

  it('renders "No movies found." when no movies are returned', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const Page = await MoviesPage();
    render(Page);

    await waitFor(() => {
      expect(screen.getByText('No movies found.')).toBeInTheDocument();
    });
  });

  it('throws an error when fetch fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    // We expect the component to throw an error, which should be caught by an error boundary
    // or handled by Next.js. For testing, we can check if the promise rejects.
    try {
      await MoviesPage(); // Call the async component function
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toBe('Failed to fetch movies');
    }
    // Ensure it was actually called
     expect(fetch).toHaveBeenCalledTimes(1);
  });
});
