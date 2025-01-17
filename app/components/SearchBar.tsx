"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";
import { movieService } from "@/services/tmdb";

interface SearchBarProps {
  onSearchResults?: (results: Movie[]) => void;
  onSuggestionClick?: () => void;
}

export default function SearchBar({
  onSearchResults,
  onSuggestionClick,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        onSearchResults?.([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await movieService.searchMovies(query);
        if (data && data.results) {
          setSuggestions(data.results.slice(0, 5));
          onSearchResults?.(data.results);
          setShowSuggestions(true);
        }
      } catch (error) {
        setError("Error during search");
        setSuggestions([]);
        onSearchResults?.([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      searchMovies();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, onSearchResults]);

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a movie..."
        className="w-full px-4 py-2 bg-white/10 rounded-lg focus:ring-1 focus:ring-white/30 outline-none"
      />

      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-500/10 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && !error && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] rounded-lg shadow-xl border border-white/10 max-h-96 overflow-y-auto z-50">
          {suggestions.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors"
              onClick={() => {
                setShowSuggestions(false);
                setQuery("");
                onSuggestionClick?.();
              }}
            >
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  width={46}
                  height={69}
                  className="rounded"
                />
              ) : (
                <div className="w-[46px] h-[69px] bg-[#2a2a2a] rounded flex items-center justify-center">
                  <span className="text-white/40 text-xs">No image</span>
                </div>
              )}
              <div>
                <h3 className="font-medium text-white/90">{movie.title}</h3>
                <p className="text-sm text-white/60">
                  {movie.release_date &&
                    new Date(movie.release_date).getFullYear()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
