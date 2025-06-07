import Link from 'next/link';
import type { Movie } from '@/types';

async function getMovies(): Promise<Movie[]> {
  // Ensure this URL is accessible from the Next.js server environment
  const res = await fetch('http://localhost:8080/movies', { cache: 'no-store' });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch movies');
  }

  return res.json();
}

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Movies</h1>
      {movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <ul className="space-y-4">
          {movies.map((movie) => (
            <li key={movie._id} className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">
                <Link href={`/movies/${movie._id}`} className="text-blue-600 hover:underline">
                  {movie.name}
                </Link>
              </h2>
              <p className="text-gray-600">{movie.genre}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
