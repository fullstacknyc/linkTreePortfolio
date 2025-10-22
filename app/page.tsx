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

      {/* Resume Section */}
      <section id="resume" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Resume</h2>
          <div className="text-center">
            <p className="text-lg text-gray-300 mb-8">
              View my professional experience and skills
            </p>
            <a 
              href="https://www.linkedin.com/in/camilogomezvalencia/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              View on LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
          <div className="text-center">
            <p className="text-lg text-gray-300 mb-8">
              Explore my code repositories and projects
            </p>
            <a 
              href="https://github.com/your-username" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Contact</h2>
          <p className="text-lg text-gray-300 mb-8">
            Get in touch with me
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="mailto:your-email@example.com"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Email
            </a>
            <a 
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/your-username"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
