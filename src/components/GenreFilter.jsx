function formatGenreLabel(genre) {
  return genre.charAt(0).toUpperCase() + genre.slice(1);
}

function GenreFilter({ genres, selected, onChange }) {
  return (
    <div className="genre-filter" role="tablist" aria-label="Filter by genre">
      {genres.map((genre) => (
        <button
          key={genre}
          type="button"
          role="tab"
          aria-selected={selected === genre}
          className={`genre-filter-btn ${selected === genre ? "genre-filter-btn--active" : ""}`}
          onClick={() => onChange(genre)}
        >
          {formatGenreLabel(genre)}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;
