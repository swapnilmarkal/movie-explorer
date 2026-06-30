import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import PageHero from "../components/PageHero";
import MovieGrid from "../components/MovieGrid";
import { useFavorites } from "../context/FavoritesContext";

function Favorites() {
  const { favorites } = useFavorites();

  return (
    <main>
      <PageHero
        title="My Favorites"
        subtitle={
          favorites.length
            ? `${favorites.length} saved title${favorites.length === 1 ? "" : "s"}`
            : "Save movies and series you love to watch later."
        }
        backdropItem={favorites[0]}
      />

      <section className="page-content container">
        {favorites.length === 0 ? (
          <div className="empty-state empty-state--large">
            <FiHeart className="empty-state-icon" />
            <p>No favorites yet.</p>
            <p className="empty-state-hint">
              Click the heart on any movie or series card to save it here.
            </p>
            <Link to="/" className="btn btn-primary">
              Browse Titles
            </Link>
          </div>
        ) : (
          <MovieGrid items={favorites} />
        )}
      </section>
    </main>
  );
}

export default Favorites;
