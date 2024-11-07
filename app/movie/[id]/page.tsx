import { movieService } from "../../../app/services/tmdb";
import Image from "next/image";
import { FiClock, FiCalendar, FiDollarSign, FiGlobe } from "react-icons/fi";
import { BiPlay } from "react-icons/bi";
import Link from "next/link";
import MovieCard from "../../components/MovieCard";
import FavoriteButton from "../../components/FavoriteButton";

function formatBudget(amount: number | null | undefined): string {
  if (!amount) return "Non défini";
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(2)}B $`;
  }
  return `${(amount / 1000000).toFixed(1)}M $`;
}

export default async function MovieDetail(props: any) {
  const id = props.params.id;
  const [movie, credits, videos, watchProviders] = await Promise.all([
    movieService.getMovieDetails(id),
    movieService.getMovieCredits(id),
    movieService.getMovieVideos(id),
    movieService.getWatchProviders(id),
  ]);

  const movieGenreIds = movie.genres?.map((genre: any) => genre.id) || [];

  const [recommendations, similarMovies] = await Promise.all([
    movieService.getMovieRecommendations(id),
    movieService.getSimilarMovies(id),
  ]);

  const allSuggestions = [
    ...(recommendations.results || []),
    ...(similarMovies.results || []),
  ]
    .filter(
      (movie, index, self) =>
        index === self.findIndex((m) => m.id === movie.id)
    )
    .map((movie) => ({
      ...movie,
      genreMatchCount:
        movie.genre_ids?.filter((id: number) => movieGenreIds.includes(id))
          .length || 0,
      poster_path: movie.poster_path || "",
      title: movie.title || "",
      vote_average: movie.vote_average || 0,
      release_date: movie.release_date || "",
      id: movie.id,
    }))
    .sort((a, b) => {
      if (b.genreMatchCount !== a.genreMatchCount) {
        return b.genreMatchCount - a.genreMatchCount;
      }
      const scoreA =
        a.vote_average * Math.log10(a.vote_count) + a.popularity / 100;
      const scoreB =
        b.vote_average * Math.log10(b.vote_count) + b.popularity / 100;
      return scoreB - scoreA;
    })
    .filter((movie) => movie.genreMatchCount > 0)
    .slice(0, 5);

  const hasRecommendations = allSuggestions.length > 0;

  const trailers = videos.results?.filter(
    (video: any) =>
      (video.type === "Trailer" || video.type === "Teaser") &&
      (video.iso_639_1 === "fr" || video.iso_639_1 === "en")
  );

  const providers = watchProviders.results?.FR;

  return (
    <main className="min-h-screen bg-[#121212]">
      {/* Hero Section with backdrop */}
      <div className="relative h-[40vh] sm:h-[70vh]">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover "
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-32 sm:-mt-64 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-12">
          {/* Left Column - Post and Quick Info */}
          <div className="w-full lg:w-1/3 mb-6 sm:mb-8">
            <div className="group relative rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 max-md:max-w-[250px] mx-auto">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={400}
                height={600}
                className="w-full"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton movie={movie} />
              </div>
            </div>

            {/* Quick info */}
            <div className="mt-8 bg-[#1a1a1a] rounded-xl p-6 space-y-4">
              <InfoItem
                icon={<FiCalendar />}
                label="Date de sortie"
                value={new Date(movie.release_date).toLocaleDateString("fr-FR")}
              />
              <InfoItem
                icon={<FiClock />}
                label="Durée"
                value={`${movie.runtime} minutes`}
              />
              <InfoItem
                icon={<FiGlobe />}
                label="Langue"
                value={movie.original_language.toUpperCase()}
              />

              {/* Financial section */}
              <div className="border-t border-white/10 pt-4 mt-4">
                <h3 className="text-lg font-medium mb-3 text-white/90">
                  Financial information
                </h3>
                <div className="space-y-3">
                  <InfoItem
                    icon={<FiDollarSign />}
                    label="Coût de production"
                    value={formatBudget(movie.budget)}
                  />
                  <InfoItem
                    icon={<FiDollarSign />}
                    label="Gains en salles"
                    value={formatBudget(movie.revenue)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Details */}
          <div className="w-full lg:w-2/3 space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
                {movie.title}
              </h1>
              <div className="flex flex-wrap gap-3 mb-6">
                {movie.genres?.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-sm font-medium
                    hover:bg-indigo-500/30 transition-colors duration-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Rating and Popularity */}
            <div className="flex items-center gap-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-yellow-500/20" />
                <div className="absolute inset-1 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                  <span className="text-2xl font-bold text-yellow-500">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-white/60">User Rating</p>
                <p className="text-white/90">
                  Based on {movie.vote_count.toLocaleString()} votes
                </p>
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Synopsis</h2>
              <p className="text-lg leading-relaxed text-white/80">
                {movie.overview || "Aucun synopsis disponible."}
              </p>
            </div>

            {/* Trailers */}
            {trailers && trailers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Trailers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trailers.slice(0, 2).map((trailer: any) => (
                    <div
                      key={trailer.id}
                      className="bg-[#1a1a1a] rounded-xl overflow-hidden"
                    >
                      <div className="relative aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${trailer.key}`}
                          title={trailer.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BiPlay className="text-red-500 text-xl" />
                          <span className="text-white/90 font-medium">
                            {trailer.type}
                          </span>
                        </div>
                        <p className="text-sm text-white/60">{trailer.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Distribution */}
            <div className="py-9">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                Distribution principale
              </h2>
              <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {credits.cast?.slice(0, 8).map((actor: any) => (
                  <div
                    key={actor.id}
                    className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                  >
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        width={200}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-[#2a2a2a] flex items-center justify-center">
                        <span className="text-white/40">No image</span>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="font-medium text-white/90">{actor.name}</p>
                      <p className="text-sm text-white/60">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section des recommandations avec vérification plus stricte */}
      {hasRecommendations && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6">Recommended Movies</h2>
          <div className="flex gap-4 overflow-x-auto whitespace-nowrap">
            {allSuggestions.map((movie: any) => (
              <div className="inline-block min-w-[150px]" key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Où regarder */}
      {providers && (
        <div className="container mx-auto px-4 mt-8 pb-10">
          <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-medium mb-3 text-white/90">
              Disponible sur
            </h3>

            {/* Streaming par abonnement */}
            {providers.flatrate && providers.flatrate.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                  <h4 className="text-sm font-medium text-white/90">
                    Subscription streaming
                  </h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {providers.flatrate.map((provider: any) => (
                    <div
                      key={provider.provider_id}
                      className="group flex items-center gap-2.5 bg-[#2a2a2a] hover:bg-[#333333] 
                        rounded-lg p-2.5 transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative">
                        <Image
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={32}
                          height={32}
                          className="rounded-md shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-sm font-medium text-white/80 group-hover:text-white">
                        {provider.provider_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location à l'unité */}
            {providers.rent && providers.rent.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                  <h4 className="text-sm font-medium text-white/90">
                    Single unit rental
                  </h4>
                </div>
                <div className="flex flex-wrap gap-3">
                  {providers.rent.map((provider: any) => (
                    <div
                      key={provider.provider_id}
                      className="group flex items-center gap-2.5 bg-[#2a2a2a] hover:bg-[#333333] 
                        rounded-lg p-2.5 transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative">
                        <Image
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={32}
                          height={32}
                          className="rounded-md shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-sm font-medium text-white/80 group-hover:text-white">
                        {provider.provider_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lien JustWatch */}
            {providers.link && (
              <div className="pt-4 border-t border-white/10">
                <a
                  href={providers.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-indigo-400 
                    hover:text-indigo-300 transition-colors duration-300"
                >
                  <span>See prices and more details on JustWatch</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-white/80">
      <div className="text-indigo-400 text-xl">{icon}</div>
      <div>
        <p className="text-sm text-white/60">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
