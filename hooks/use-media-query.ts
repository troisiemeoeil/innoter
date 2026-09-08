"use client"

import * as React from "react"

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)

    // Set initial value
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern browsers
    media.addEventListener("change", listener)

    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}