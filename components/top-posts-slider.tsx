"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Post, Category, Tag } from "@/lib/wordpress.d"

interface TopPostsSliderProps {
  posts: Post[]
}

export function TopPostsSlider({ posts }: TopPostsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  // Get top 5 posts for the slider
  const sliderPosts = posts.slice(0, 5)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderPosts.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, sliderPosts.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setAutoPlay(false)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderPosts.length)
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + sliderPosts.length) % sliderPosts.length)
    setAutoPlay(false)
  }

  if (sliderPosts.length === 0) return null

  const currentPost = sliderPosts[currentIndex]

  // Get data from embedded fields
  const featuredImage = currentPost._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const primaryCategory = currentPost._embedded?.['wp:term']?.[0]?.find((term: Category | Tag) => term.taxonomy === 'category')

  return (
    <section className="bg-card border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Top Posts of the Week</h2>
          <div className="h-1 w-16 bg-accent rounded-full"></div>
        </div>

        {/* Slider Container */}
        <div className="relative group">
          {/* Main Slide */}
          <Link href={`/blog/${currentPost.slug}`}>
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-muted cursor-pointer">
              {/* Image */}
              <img
                src={featuredImage || "/placeholder.svg"}
                alt={currentPost.title.rendered}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                    {primaryCategory?.name || "Uncategorized"}
                  </span>
                  <span className="text-sm font-medium opacity-80">Week's Pick</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-bold mb-2 line-clamp-2">{currentPost.title.rendered}</h3>
                <p className="text-sm md:text-base opacity-90 line-clamp-2">{currentPost.excerpt.rendered.replace(/<[^>]*>/g, '')}</p>
              </div>
            </div>
          </Link>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-accent text-white hover:text-accent-foreground p-3 rounded-full backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-accent text-white hover:text-accent-foreground p-3 rounded-full backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-6">
          {sliderPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-accent w-8" : "bg-muted hover:bg-muted-foreground w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
