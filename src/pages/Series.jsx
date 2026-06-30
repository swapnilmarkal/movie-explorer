import { useEffect, useState } from "react";
import PageHero from "../components/PageHero";
import MovieGrid from "../components/MovieGrid";
import GenreFilter from "../components/GenreFilter";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { SERIES_GENRES } from "../constants/omdb";
import { fetchPagedSearch, hasApiKey } from "../services/omdb";

function Series() {
  const [genre, setGenre] = useState(SERIES_GENRES[0]);
  const [page, setPage] = useState(1);
  const [series, setSeries] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSeries = async (selectedGenre, selectedPage) => {
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
        { type: "series", page: selectedPage },
      );
      setSeries(items);
      setTotalResults(total);
    } catch (err) {
      setError(err.message);
      setSeries([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeries(genre, page);
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
        title="TV Series"
        subtitle={`Explore ${genre} series worth binge-watching.`}
        backdropItem={series[0]}
      />

      <section className="page-content container">
        <GenreFilter
          genres={SERIES_GENRES}
          selected={genre}
          onChange={handleGenreChange}
        />

        {loading && <Loader label="Loading series..." />}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => loadSeries(genre, page)}
          />
        )}
        {!loading && !error && (
          <>
            <p className="results-count">
              {totalResults.toLocaleString()} result
              {totalResults === 1 ? "" : "s"} for{" "}
              <strong>{genre.charAt(0).toUpperCase() + genre.slice(1)}</strong>
            </p>
            <MovieGrid items={series} />
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

export default Series;
