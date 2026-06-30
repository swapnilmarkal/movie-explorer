import { PLACEHOLDER_POSTER } from "../constants/omdb";
import { getPosterUrl } from "../services/omdb";

function PageHero({ title, subtitle, backdropItem }) {
  const poster = backdropItem
    ? getPosterUrl(backdropItem.Poster) || PLACEHOLDER_POSTER
    : null;

  return (
    <section className="page-hero">
      {poster && (
        <div className="page-hero-backdrop">
          <img src={poster} alt="" aria-hidden="true" />
          <div className="page-hero-gradient" />
        </div>
      )}

      <div className="page-hero-content container">
        <h1 className="page-hero-title">{title}</h1>
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}

export default PageHero;
