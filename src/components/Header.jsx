import { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { FiHeart, FiSearch } from "react-icons/fi";
import { useFavorites } from "../context/FavoritesContext";

function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const { favorites } = useFavorites();

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="header">
      <div className="container header-content">
        <NavLink to="/" className="logo">
          <span className="logo-primary">MOVIE</span>
          <span className="logo-secondary">EXPLORER</span>
        </NavLink>

        <nav className="nav-menu">
          <ul className="nav-links">
            <li>
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/movies">Movies</NavLink>
            </li>
            <li>
              <NavLink to="/series">Series</NavLink>
            </li>
            <li>
              <NavLink to="/favorites" className="nav-favorites">
                <FiHeart />
                Favorites
                {favorites.length > 0 && (
                  <span className="nav-badge">{favorites.length}</span>
                )}
              </NavLink>
            </li>
          </ul>

          <form className="search-box" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search movies & series..."
              className="search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
        </nav>
      </div>
    </header>
  );
}

export default Header;
