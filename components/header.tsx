"use client"

import { useState } from "react"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 md:py-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">TRIBITAT</span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Home
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Featured
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Categories
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              About
            </a>
          </nav>

          {/* Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-accent" /> : <Moon className="h-5 w-5 text-primary" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3 border-t border-border pt-4">
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Home
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Featured
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Categories
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              About
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
