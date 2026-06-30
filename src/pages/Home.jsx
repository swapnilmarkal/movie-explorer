import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import {
  NEW_RELEASE_QUERIES,
  POPULAR_MOVIE_QUERIES,
  POPULAR_SERIES_QUERIES,
} from "../constants/omdb";
import {
  fetchFromQueries,
  getTitleById,
  hasApiKey,
} from "../services/omdb";

function Home() {
  const [featured, setFeatured] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContent = async () => {
    if (!hasApiKey()) {
      setError(
        "Add your OMDB API key to .env as VITE_OMDB_API_KEY. Get one free at omdbapi.com/apikey.aspx",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [movies, series, releases] = await Promise.all([
        fetchFromQueries(POPULAR_MOVIE_QUERIES, { type: "movie" }),
        fetchFromQueries(POPULAR_SERIES_QUERIES, { type: "series" }),
        fetchFromQueries(NEW_RELEASE_QUERIES, { type: "movie" }),
      ]);

      setPopularMovies(movies);
      setPopularSeries(series);
      setNewReleases(releases);

      const spotlight = movies[0] || series[0];
      if (spotlight) {
        const details = await getTitleById(spotlight.imdbID);
        setFeatured(details);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  if (loading && !featured) {
    return (
      <main>
        <Hero loading />
        <Loader label="Loading movies and series..." />
      </main>
    );
  }

  if (error && !featured) {
    return (
      <main className="page-content">
        <ErrorMessage message={error} onRetry={loadContent} />
      </main>
    );
  }

  return (
    <main>
      <Hero item={featured} />

      <div className="home-rows">
        <MovieRow title="Popular Movies" items={popularMovies} />
        <MovieRow title="Popular Series" items={popularSeries} />
        <MovieRow title="New & Trending" items={newReleases} />
      </div>
    </main>
  );
}

export default Home;
