import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MovieDetailsPage from '../page'; // Adjust path as necessary
import type { Movie } from '@/types';

// Mock fetch
global.fetch = jest.fn();

const mockMovie: Movie = {
  _id: '123',
  name: 'Interstellar',
  genre: 'Sci-Fi',
  director: 'Christopher Nolan',
  popularity: 99,
  imdb_score: 8.6,
};

describe('MovieDetailsPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders movie details, cast, and reviews sections', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovie,
    });

    const mockParams = { params: { id: '123' } };

    // As MovieDetailsPage is an async Server Component
    const Page = await MovieDetailsPage(mockParams);
    render(Page);

    // Check for movie details
    // Using waitFor for robustness, though direct assertions might work if rendering is quick enough
    await waitFor(() => {
      expect(screen.getByText('Interstellar')).toBeInTheDocument();
    });
    expect(screen.getByText((content, element) => content.startsWith('Director:') && content.includes('Christopher Nolan'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.startsWith('Genre:') && content.includes('Sci-Fi'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.startsWith('IMDB Score:') && content.includes('8.6/10'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.startsWith('Popularity:') && content.includes('99%'))).toBeInTheDocument();


    // Check for section titles
    expect(screen.getByText('Cast')).toBeInTheDocument();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText('Cast information will be displayed here once available.')).toBeInTheDocument();
    expect(screen.getByText('More reviews coming soon!')).toBeInTheDocument();


    // Verify fetch was called
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/movies/${mockMovie._id}`, { cache: 'no-store' });
  });

  it('renders "Movie not found." when movie data is not returned', async () => {
    // This case in the component currently relies on getMovieDetails returning null/undefined
    // or throwing an error that leads to this.
    // The current component code: `if (!movie) { return <p>Movie not found</p> }`
    // To test this, we need getMovieDetails to resolve to something falsy.
    // However, getMovieDetails throws an error if !res.ok.
    // If res.ok is true but res.json() is null, it would hit this.
     (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => null, // Simulate API returning ok but no data or empty object
    });
    const mockParams = { params: { id: 'notfound' } };
    const Page = await MovieDetailsPage(mockParams);
    render(Page);

    await waitFor(() => {
      expect(screen.getByText('Movie not found.')).toBeInTheDocument();
    });
  });

  it('throws an error when fetch fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });
    const mockParams = { params: { id: 'fail' } };

    try {
      await MovieDetailsPage(mockParams);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toBe('Failed to fetch movie details');
    }
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
