"use client"

import { useState, useEffect } from 'react'

// Structured, unlockable "systems" list and a derived names array for the typewriter.
// Each system can be marked unlocked to reveal its full entry; otherwise it shows a locked hint.
type System = {
  id: string
  title: string
  description: string
  tags?: string[]
  unlocked: boolean
}

const systems: System[] = [
  {
    id: 'systems-engineering',
    title: 'Systems Engineering',
    description: 'Architecture, observability, fault tolerance, scalability, systems design',
    tags: ['architecture', 'observability', 'scalability'],
    unlocked: true,
  },
  {
    id: 'frontend',
    title: 'Front-end Development',
    description: 'TypeScript, React, Next.js, component design, accessibility, performance',
    tags: ['react', 'ts', 'design', 'a11y'],
    unlocked: true,
  },
  {
    id: 'backend',
    title: 'Back-end Development',
    description: 'APIs, databases, microservices, tRPC/GraphQL/REST, type-safe contracts',
    tags: ['api', 'db', 'microservices'],
    unlocked: false,
  },
  {
    id: 'devops',
    title: 'DevOps & Platform',
    description: 'CI/CD, infra as code, containerization, observability, deployment strategies',
    tags: ['ci/cd', 'k8s', 'terraform'],
    unlocked: false,
  },
  {
    id: 'logic',
    title: 'Logic & Algorithms',
    description: 'Formal reasoning, algorithm design, complexity, correctness',
    tags: ['algorithms', 'theory'],
    unlocked: false,
  },
  {
    id: 'design',
    title: 'Product & Visual Design',
    description: 'Design systems, component-driven UX, Figma collaboration, UX research',
    tags: ['design-systems', 'ux'],
    unlocked: true,
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship',
    description: 'Product-market fit, go-to-market, growth experiments, business strategy',
    tags: ['startup', 'growth'],
    unlocked: false,
  },
  {
    id: 'biology',
    title: 'Biology & Anatomy',
    description: 'Systems biology, anatomy fundamentals, computational biology curiosities',
    tags: ['biology', 'anatomy'],
    unlocked: false,
  },
  {
    id: 'chemistry',
    title: 'Chemistry',
    description: 'Physical & organic chemistry basics, computational chemistry interests',
    tags: ['chemistry'],
    unlocked: false,
  },
  {
    id: 'physics',
    title: 'Physics',
    description: 'Classical mechanics, electromagnetism, mathematical physics exploration',
    tags: ['physics', 'math'],
    unlocked: false,
  },
  {
    id: 'research',
    title: 'Independent Research',
    description: 'Self-driven research: experiments, papers, reproducibility, learning on own time',
    tags: ['research', 'papers'],
    unlocked: true,
  },
]

// Derive the array of strings used by the TypewriterText component.
// Locked systems show a concise hint; unlocked systems reveal title + description.
const names: string[] = systems.map((s) =>
  s.unlocked ? `${s.title}: ${s.description}` : `${s.title} — Locked (unlock to reveal)`
)

// Utility functions to toggle lock state and persist to localStorage.
// They are simple helpers; UI/stateful toggling can be wired into components later.
export function unlockSystem(id: string) {
  const s = systems.find((x) => x.id === id)
  if (!s) return
  s.unlocked = true
  try {
    const unlocked = systems.filter((x) => x.unlocked).map((x) => x.id)
    localStorage.setItem('unlockedSystems', JSON.stringify(unlocked))
  } catch {}
}

export function lockSystem(id: string) {
  const s = systems.find((x) => x.id === id)
  if (!s) return
  s.unlocked = false
  try {
    const unlocked = systems.filter((x) => x.unlocked).map((x) => x.id)
    localStorage.setItem('unlockedSystems', JSON.stringify(unlocked))
  } catch {}
}

// Initialize unlocked state from localStorage if available (client-only).
try {
  const raw = localStorage.getItem('unlockedSystems')
  if (raw) {
    const unlockedIds = JSON.parse(raw) as string[]
    systems.forEach((s) => {
      s.unlocked = unlockedIds.includes(s.id) || s.unlocked
    })
  }
} catch {}

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
