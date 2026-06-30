import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiStar } from "react-icons/fi";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import FavoriteButton from "../components/FavoriteButton";
import { PLACEHOLDER_POSTER } from "../constants/omdb";
import { getPosterUrl, getTitleById, hasApiKey } from "../services/omdb";

function DetailRow({ label, value }) {
  if (!value || value === "N/A") return null;

  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDetails = async () => {
    if (!hasApiKey()) {
      setError("Add your OMDB API key to .env as VITE_OMDB_API_KEY.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getTitleById(id);
      setMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="page-content">
        <Loader label="Loading details..." />
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="page-content container">
        <Link to="/" className="back-link">
          <FiArrowLeft />
          Back to Home
        </Link>
        <ErrorMessage message={error || "Title not found."} onRetry={loadDetails} />
      </main>
    );
  }

  const poster = getPosterUrl(movie.Poster) || PLACEHOLDER_POSTER;

  return (
    <main>
      <section className="detail-hero">
        <div className="detail-hero-backdrop">
          <img src={poster} alt="" aria-hidden="true" />
          <div className="detail-hero-gradient" />
        </div>

        <div className="detail-hero-content container">
          <Link to="/" className="back-link">
            <FiArrowLeft />
            Back
          </Link>

          <div className="detail-hero-layout">
            <div className="detail-poster">
              <img src={poster} alt={movie.Title} />
            </div>

            <div className="detail-info">
              <span className="detail-type">{movie.Type}</span>
              <h1 className="detail-title">{movie.Title}</h1>

              <div className="detail-meta">
                {movie.imdbRating && movie.imdbRating !== "N/A" && (
                  <span className="detail-rating">
                    <FiStar />
                    {movie.imdbRating} / 10
                  </span>
                )}
                {movie.Year && movie.Year !== "N/A" && (
                  <span>{movie.Year}</span>
                )}
                {movie.Runtime && movie.Runtime !== "N/A" && (
                  <span>{movie.Runtime}</span>
                )}
                {movie.Rated && movie.Rated !== "N/A" && (
                  <span className="detail-rated">{movie.Rated}</span>
                )}
              </div>

              {movie.Genre && movie.Genre !== "N/A" && (
                <div className="detail-genres">
                  {movie.Genre.split(", ").map((genre) => (
                    <span key={genre} className="genre-tag">
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {movie.Plot && movie.Plot !== "N/A" && (
                <p className="detail-plot">{movie.Plot}</p>
              )}

              <div className="detail-actions">
                <FavoriteButton
                  item={movie}
                  className="favorite-btn--large"
                  showLabel
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-body container">
        <h2 className="section-title">Details</h2>
        <div className="detail-grid">
          <DetailRow label="Director" value={movie.Director} />
          <DetailRow label="Writer" value={movie.Writer} />
          <DetailRow label="Actors" value={movie.Actors} />
          <DetailRow label="Released" value={movie.Released} />
          <DetailRow label="Language" value={movie.Language} />
          <DetailRow label="Country" value={movie.Country} />
          <DetailRow label="Awards" value={movie.Awards} />
          <DetailRow label="Box Office" value={movie.BoxOffice} />
          <DetailRow label="Production" value={movie.Production} />
        </div>

        {movie.Ratings?.length > 0 && (
          <>
            <h2 className="section-title">Ratings</h2>
            <div className="ratings-list">
              {movie.Ratings.map((rating) => (
                <div key={rating.Source} className="rating-chip">
                  <span className="rating-source">{rating.Source}</span>
                  <span className="rating-value">{rating.Value}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default MovieDetails;
