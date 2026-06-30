import MovieCard from "./MovieCard";

function MovieGrid({ items }) {
  if (!items?.length) {
    return (
      <p className="empty-state">No titles found. Try a different search.</p>
    );
  }

  return (
    <div className="movie-grid">
      {items.map((item) => (
        <MovieCard key={item.imdbID} item={item} />
      ))}
    </div>
  );
}

export default MovieGrid;
