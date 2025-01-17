"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { motion } from "framer-motion";
import { BsPlayCircleFill } from "react-icons/bs";

export default function Hero({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay for the initial animation
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Function to get a random index
    const getRandomIndex = () => Math.floor(Math.random() * movies.length);

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        // Use a new random index each time
        setCurrentIndex(getRandomIndex());
        setIsTransitioning(false);
      }, 500); // Duration of the fade-out
    }, 5000); // Change every 5 seconds

    // Set an initial random index
    setCurrentIndex(getRandomIndex());

    return () => clearInterval(timer);
  }, [movies.length]);

  const currentMovie = movies[currentIndex];

  return (
    <section className="relative h-[80vh] md:h-[90vh] flex items-center overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
          alt="Film backdrop"
          fill
          className={`object-cover transition-all duration-1000 ${
            isTransitioning
              ? "opacity-0"
              : isLoaded
              ? "opacity-90"
              : "opacity-0"
          } scale-105`}
          priority
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEkKSM7Mjc1MjM3RkNQP0RBQDc4UVBGTU9NUF9nZGdkR0xfZUdGZUb/2wBDARUXFyAeIBohHh1BLykvQUZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkb/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />

        <div
          className={`absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent md:via-[#0A0A0A]/70 transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/60 transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4 md:mb-6 flex items-center gap-2 md:gap-3"
          >
            <div className="h-[2px] w-8 md:w-12 bg-gradient-to-r from-red-700 via-red-500 to-white" />
            <span className="text-red-500 font-medium tracking-wider text-xs md:text-sm">
              NEVER RUN OUT OF IDEAS AGAIN
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-8 leading-tight md:leading-none tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/70 text-transparent bg-clip-text">
              The perfect movie for your evening in just a few clicks
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base md:text-xl text-gray-300/90 max-w-2xl mb-8 md:mb-12 leading-relaxed"
          >
            Action, comedy, drama, or science fiction? Discover films that match
            your current mood.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 items-stretch sm:items-center"
          >
            <Link href="/genres" className="flex-1 sm:flex-initial">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative inline-flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm px-6 md:px-8 py-3 md:py-4 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <BsPlayCircleFill className="w-4 h-4 md:w-5 md:h-5 relative z-10" />
                <span className="relative z-10 font-medium text-sm md:text-base">
                  Find my movie
                </span>
              </motion.button>
            </Link>

            <Link href="/top-rated" className="flex-1 sm:flex-initial">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 md:px-8 py-3 md:py-4 rounded-lg text-white font-medium text-sm md:text-base 
                border border-white/10 hover:bg-white/5 hover:border-red-500/20 transition-colors backdrop-blur-sm"
              >
                Top-rated movies
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
