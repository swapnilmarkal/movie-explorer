import { Link } from "react-router-dom";
import { PLACEHOLDER_POSTER } from "../constants/omdb";
import { getPosterUrl } from "../services/omdb";
import FavoriteButton from "./FavoriteButton";

function MovieCard({ item, showFavorite = true }) {
  const poster = getPosterUrl(item.Poster) || PLACEHOLDER_POSTER;

  return (
    <article className="movie-card-wrapper">
      <Link to={`/movie/${item.imdbID}`} className="movie-card">
        <div className="movie-card-poster">
          <img src={poster} alt={item.Title} loading="lazy" />
          <div className="movie-card-overlay">
            <span className="movie-card-type">{item.Type}</span>
          </div>
        </div>
        <div className="movie-card-info">
          <h3 className="movie-card-title">{item.Title}</h3>
          <p className="movie-card-year">{item.Year}</p>
        </div>
      </Link>
      {showFavorite && <FavoriteButton item={item} />}
    </article>
  );
}

export default MovieCard;
