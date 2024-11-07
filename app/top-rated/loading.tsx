export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="container mx-auto py-12 md:py-16 lg:py-24 px-4 sm:px-6 max-w-[1400px]">
        <div
          className="relative backdrop-blur-3xl bg-white/5 rounded-lg md:rounded-2xl lg:rounded-3xl 
          p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl"
        >
          {/* Page Header */}
          <div className="relative mb-8 md:mb-12 lg:mb-16">
            {/* Decorative Bar */}
            <div
              className="absolute left-0 md:-top-4 w-16 md:w-24 h-0.5 md:h-1 
              bg-gradient-to-r from-red-700 via-red-500 to-white"
            ></div>

            {/* Title and Subtitle */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white pt-2">
              Top Rated
              <span className="block mt-2 text-xs sm:text-sm font-normal text-gray-400">
                The top 100 highest-rated movies
              </span>
            </h1>
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 px-2 sm:px-0">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/10 rounded-lg aspect-[2/3] mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
