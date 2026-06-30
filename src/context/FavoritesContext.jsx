import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "movie-explorer-favorites";

const FavoritesContext = createContext(null);

function readStoredFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readStoredFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (imdbID) =>
    favorites.some((item) => item.imdbID === imdbID);

  const addFavorite = (item) => {
    if (isFavorite(item.imdbID)) return;

    setFavorites((prev) => [
      ...prev,
      {
        imdbID: item.imdbID,
        Title: item.Title,
        Year: item.Year,
        Type: item.Type,
        Poster: item.Poster,
      },
    ]);
  };

  const removeFavorite = (imdbID) => {
    setFavorites((prev) => prev.filter((item) => item.imdbID !== imdbID));
  };

  const toggleFavorite = (item) => {
    if (isFavorite(item.imdbID)) {
      removeFavorite(item.imdbID);
    } else {
      addFavorite(item);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }

  return context;
}
