const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

function buildUrl(params) {
  const url = new URL(BASE_URL);
  url.searchParams.set("apikey", API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to reach OMDB. Please try again.");
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error || "No results found.");
  }

  return data;
}

export function hasApiKey() {
  return Boolean(API_KEY);
}

export async function searchTitles({
  query,
  type,
  page = 1,
  year,
} = {}) {
  return fetchJson(
    buildUrl({
      s: query,
      type,
      page,
      y: year,
    }),
  );
}

export async function getTitleById(imdbID) {
  return fetchJson(
    buildUrl({
      i: imdbID,
      plot: "full",
    }),
  );
}

export async function fetchFromQueries(queries, { type, year } = {}) {
  const results = await Promise.allSettled(
    queries.map((query) => searchTitles({ query, type, year, page: 1 })),
  );

  const merged = [];
  const seen = new Set();

  results.forEach((result) => {
    if (result.status !== "fulfilled") return;

    const items = result.value.Search || [];
    items.forEach((item) => {
      if (!seen.has(item.imdbID)) {
        seen.add(item.imdbID);
        merged.push(item);
      }
    });
  });

  return merged;
}

export async function fetchPagedSearch(query, { type, page = 1 } = {}) {
  const data = await searchTitles({ query, type, page });
  return {
    items: data.Search || [],
    totalResults: Number(data.totalResults || 0),
  };
}

export function getPosterUrl(poster) {
  if (!poster || poster === "N/A") {
    return null;
  }

  return poster;
}
