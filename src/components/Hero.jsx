import { Link } from "react-router-dom";
import { FiPlay, FiInfo } from "react-icons/fi";
import { PLACEHOLDER_POSTER } from "../constants/omdb";
import { getPosterUrl } from "../services/omdb";

function Hero({ item, loading }) {
  if (loading) {
    return (
      <section className="hero hero-loading">
        <div className="hero-content container">
          <div className="hero-skeleton" />
        </div>
      </section>
    );
  }

  if (!item) return null;

  const poster = getPosterUrl(item.Poster) || PLACEHOLDER_POSTER;

  return (
    <section className="hero">
      <div className="hero-backdrop">
        <img src={poster} alt="" aria-hidden="true" />
        <div className="hero-gradient" />
      </div>

      <div className="hero-content container">
        <span className="hero-badge">Featured</span>
        <h1 className="hero-title">{item.Title}</h1>

        <div className="hero-meta">
          {item.imdbRating && item.imdbRating !== "N/A" && (
            <span className="hero-rating">{item.imdbRating} IMDb</span>
          )}
          {item.Year && item.Year !== "N/A" && (
            <span className="hero-year">{item.Year}</span>
          )}
          {item.Runtime && item.Runtime !== "N/A" && (
            <span className="hero-runtime">{item.Runtime}</span>
          )}
          {item.Genre && item.Genre !== "N/A" && (
            <span className="hero-genre">{item.Genre.split(",")[0]}</span>
          )}
        </div>

        {item.Plot && item.Plot !== "N/A" && (
          <p className="hero-plot">{item.Plot}</p>
        )}

        <div className="hero-actions">
          <Link to={`/movie/${item.imdbID}`} className="btn btn-primary">
            <FiPlay />
            Watch Now
          </Link>
          <Link to={`/movie/${item.imdbID}`} className="btn btn-secondary">
            <FiInfo />
            More Info
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
