import { useEffect, useState } from "react";
import PageHero from "../components/PageHero";
import MovieGrid from "../components/MovieGrid";
import GenreFilter from "../components/GenreFilter";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { MOVIE_GENRES } from "../constants/omdb";
import { fetchPagedSearch, hasApiKey } from "../services/omdb";

function Movies() {
  const [genre, setGenre] = useState(MOVIE_GENRES[0]);
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMovies = async (selectedGenre, selectedPage) => {
    if (!hasApiKey()) {
      setError("Add your OMDB API key to .env as VITE_OMDB_API_KEY.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { items, totalResults: total } = await fetchPagedSearch(
        selectedGenre,
        { type: "movie", page: selectedPage },
      );
      setMovies(items);
      setTotalResults(total);
    } catch (err) {
      setError(err.message);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(genre, page);
  }, [genre, page]);

  const handleGenreChange = (nextGenre) => {
    setGenre(nextGenre);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <PageHero
        title="Movies"
        subtitle={`Browse ${genre} films and discover your next watch.`}
        backdropItem={movies[0]}
      />

      <section className="page-content container">
        <GenreFilter
          genres={MOVIE_GENRES}
          selected={genre}
          onChange={handleGenreChange}
        />

        {loading && <Loader label="Loading movies..." />}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => loadMovies(genre, page)}
          />
        )}
        {!loading && !error && (
          <>
            <p className="results-count">
              {totalResults.toLocaleString()} result
              {totalResults === 1 ? "" : "s"} for{" "}
              <strong>{genre.charAt(0).toUpperCase() + genre.slice(1)}</strong>
            </p>
            <MovieGrid items={movies} />
            <Pagination
              page={page}
              totalResults={totalResults}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </main>
  );
}

export default Movies;
