"use client"

import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

export default function AOSInitializer() {
  useEffect(() => {
    AOS.init({
      duration: 800, // duration of the animation
      once: true,    // whether animation should happen only once - while scrolling down
    })
  }, [])

  return null // This component doesn't render anything
}
