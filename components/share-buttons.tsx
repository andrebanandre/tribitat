"use client"

import { Share2, Mail, Linkedin } from "lucide-react"
import { useState } from "react"

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const fullUrl = `${baseUrl}${url}`

  const shareOnX = () => {
    const text = encodeURIComponent(`Check out: ${title}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(fullUrl)}`, "_blank")
  }

  const shareOnLinkedIn = () => {
    const text = encodeURIComponent(title)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}&title=${text}`,
      "_blank",
    )
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check this out: ${title}`)
    const body = encodeURIComponent(`I thought you'd find this interesting:\n\n${title}\n${fullUrl}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground hidden sm:inline">Share:</span>
      <button
        onClick={shareOnX}
        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-accent transition-colors"
        aria-label="Share on X"
        title="Share on X"
      >
        <Share2 size={20} />
      </button>
      <button
        onClick={shareViaEmail}
        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-accent transition-colors"
        aria-label="Share via Email"
        title="Share via Email"
      >
        <Mail size={20} />
      </button>
      <button
        onClick={shareOnLinkedIn}
        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-accent transition-colors"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <Linkedin size={20} />
      </button>
    </div>
  )
}
