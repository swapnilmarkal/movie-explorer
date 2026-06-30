import { FiHeart } from "react-icons/fi";
import { useFavorites } from "../context/FavoritesContext";

function FavoriteButton({ item, className = "", showLabel = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(item.imdbID);

  return (
    <button
      type="button"
      className={`favorite-btn ${active ? "favorite-btn--active" : ""} ${className}`.trim()}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(item);
      }}
    >
      <FiHeart />
      {showLabel && (
        <span>{active ? "Remove from Favorites" : "Add to Favorites"}</span>
      )}
    </button>
  );
}

export default FavoriteButton;
