import { movieService } from "../services/tmdb";
import Link from "next/link";
import { Genre } from "../types/movie";

const genreIcons: { [key: string]: string } = {
  Action: "🎬",
  Adventure: "🗺️",
  Animation: "🎨",
  Comedy: "😄",
  Crime: "🚔",
  Documentary: "📚",
  Drama: "🎭",
  Family: "👨‍👩‍👧‍👦",
  Fantasy: "🧙‍♂️",
  History: "📜",
  Horror: "👻",
  Music: "🎵",
  Mystery: "🔍",
  Romance: "💕",
  "Science-Fiction": "🚀",
  TVMovie: "📺",
  Thriller: "😱",
  War: "⚔️",
  Western: "🤠",
};

export default async function GenresPage() {
  const { genres } = await movieService.getGenres();

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto py-12 md:py-16 lg:py-24 px-4 sm:px-6 max-w-[1400px]">
        <div
          className="relative backdrop-blur-3xl bg-white/5 rounded-lg md:rounded-2xl lg:rounded-3xl 
          p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl"
        >
          {/* Page Header */}
          <div className="relative mb-8 md:mb-12 lg:mb-16">
            <div
              className="absolute left-0 -top-1 md:-top-4 w-16 md:w-24 h-0.5 md:h-1 
              bg-gradient-to-r from-red-700 via-red-500 to-white"
            ></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white pt-2">
              Explore by Genre
              <span className="block mt-2 text-xs sm:text-sm font-normal text-gray-400">
                Discover all movie genres
              </span>
            </h1>
          </div>

          {/* Genre Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {genres.map((genre: Genre) => (
              <Link
                key={genre.id}
                href={`/genres/${genre.id}`}
                className="group"
              >
                <div
                  className="bg-neutral-600/10 rounded-lg md:rounded-xl p-4 sm:p-6 md:p-8 
                    transition-all duration-300 ease-out hover:bg-neutral-500/10 hover:scale-[1.02]
                   "
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Icon */}
                    <span
                      className="text-2xl sm:text-3xl md:text-4xl 
                      transition-transform duration-300 group-hover:scale-110"
                    >
                      {genreIcons[genre.name] || "🎥"}
                    </span>

                    {/* Texts */}
                    <div>
                      <h2
                        className="text-base sm:text-lg md:text-xl font-medium 
                        text-white/90 group-hover:text-white transition-colors"
                      >
                        {genre.name}
                      </h2>
                      <p
                        className="text-xs sm:text-sm text-white/50 
                        group-hover:text-white/70 transition-colors"
                      >
                        Discover the movies
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
