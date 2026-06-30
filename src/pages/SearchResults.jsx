import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { searchTitles, hasApiKey } from "../services/omdb";

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setResults([]);
      setTotalResults(0);
      setError("");
      return;
    }

    const runSearch = async () => {
      if (!hasApiKey()) {
        setError("Add your OMDB API key to .env as VITE_OMDB_API_KEY.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await searchTitles({ query, page });
        setResults(data.Search || []);
        setTotalResults(Number(data.totalResults || 0));
      } catch (err) {
        setError(err.message);
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query, page]);

  const handlePageChange = (nextPage) => {
    setSearchParams({ q: query, page: String(nextPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <PageHero
        title={query ? `Results for "${query}"` : "Search"}
        subtitle={
          query
            ? `${totalResults.toLocaleString()} title${totalResults === 1 ? "" : "s"} found`
            : "Enter a movie or series name in the search bar."
        }
        backdropItem={results[0]}
      />

      <section className="page-content container">
        {!query && (
          <p className="empty-state">
            Use the search box in the header to find movies and series.
          </p>
        )}

        {query && loading && <Loader label="Searching..." />}
        {query && error && <ErrorMessage message={error} />}
        {query && !loading && !error && (
          <>
            <MovieGrid items={results} />
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

export default SearchResults;
