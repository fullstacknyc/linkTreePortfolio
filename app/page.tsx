"use client"

import { useState, useEffect } from 'react'

const names: string[] = [
  'Systems Engineering',
  'Frontend Development',
  'Full-Stack Development',
  'AI Development',
  'Machine Learning',
  'Data Science',
  'Cybersecurity',
]


function TypewriterText({ names }: { names: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100 // Faster when deleting
    const pauseDuration = isDeleting ? 0 : 2000 // Pause after typing complete
    
    const timeout = setTimeout(() => {
      const currentName = names[currentIndex]
      
      if (!isDeleting && currentText === currentName) {
        // Finished typing, pause then start deleting
        setTimeout(() => setIsDeleting(true), pauseDuration)
        return
      }
      
      if (isDeleting && currentText === '') {
        // Finished deleting, move to next name
        setIsDeleting(false)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % names.length)
        return
      }
      
      if (isDeleting) {
        setCurrentText(currentName.substring(0, currentText.length - 1))
      } else {
        setCurrentText(currentName.substring(0, currentText.length + 1))
      }
    }, typeSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex, names])

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span className="relative">
      {currentText}
      <span className={`inline-block w-0.5 h-8 bg-white ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
      </span>
    </span>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <h1 className="text-5xl font-bold min-h-[4rem] flex items-center">
          <TypewriterText names={names} />
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Book a meeting <a href="#">here</a>.
        </p>
      </div>
    </div>
  )
}
