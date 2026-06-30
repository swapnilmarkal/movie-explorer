import MovieCard from "./MovieCard";

function MovieRow({ title, items }) {
  if (!items?.length) return null;

  return (
    <section className="movie-row">
      <div className="container">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="movie-row-scroll">
        <div className="movie-row-track">
          {items.map((item) => (
            <MovieCard key={item.imdbID} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MovieRow;
