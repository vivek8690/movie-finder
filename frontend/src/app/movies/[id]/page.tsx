import Link from 'next/link';
import type { Movie } from '@/types';

interface MovieDetailsPageProps {
  params: {
    id: string;
  };
}

async function getMovieDetails(id: string): Promise<Movie> {
  // Ensure this URL is accessible from the Next.js server environment
  const res = await fetch(`http://localhost:8080/movies/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    // Or, you could return a specific not-found state if appropriate
    throw new Error('Failed to fetch movie details');
  }

  return res.json();
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const movie = await getMovieDetails(params.id);

  if (!movie) {
    // Handle case where movie is not found, e.g., by using Next.js notFound()
    // For now, error boundary will catch it or it might show an empty page if getMovieDetails could return null/undefined
    return <p className="text-center text-red-500">Movie not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/movies" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Movies
      </Link>

      <article className="p-6 border rounded-lg shadow-lg bg-white">
        <h1 className="text-3xl font-bold mb-3">{movie.name}</h1>
        <p className="text-lg text-gray-700 mb-1">
          <span className="font-semibold">Director:</span> {movie.director}
        </p>
        <p className="text-lg text-gray-700 mb-1">
          <span className="font-semibold">Genre:</span> {movie.genre}
        </p>
        <p className="text-lg text-gray-700 mb-1">
          <span className="font-semibold">IMDB Score:</span> {movie.imdb_score}/10
        </p>
        <p className="text-lg text-gray-700 mb-4">
          <span className="font-semibold">Popularity:</span> {movie.popularity}%
        </p>

        <div className="mt-6 pt-4 border-t">
          <h2 className="text-2xl font-semibold mb-2">Cast</h2>
          <p className="text-gray-600 italic">
            Cast information will be displayed here once available.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t">
          <h2 className="text-2xl font-semibold mb-3">Reviews</h2>
          <div className="space-y-4">
            {/* Static Placeholder Review 1 */}
            <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
              <div className="flex items-center mb-1">
                <h3 className="text-lg font-semibold text-gray-800">Reviewer One</h3>
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-200 rounded-full">5 Stars</span>
              </div>
              <p className="text-gray-700">
                This was an amazing movie! Highly recommended.
              </p>
            </div>

            {/* Static Placeholder Review 2 */}
            <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
              <div className="flex items-center mb-1">
                <h3 className="text-lg font-semibold text-gray-800">Reviewer Two</h3>
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">3 Stars</span>
              </div>
              <p className="text-gray-700">
                It was okay, had some good parts but also some boring ones.
              </p>
            </div>

            <p className="text-center text-gray-500 italic mt-6">
              More reviews coming soon!
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
