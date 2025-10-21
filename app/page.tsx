"use client"

import { useState, useEffect } from 'react'

const names = [
  "HTML, CSS, JS",
  "Git, Github, Vercel",
  "React, Next.js, Tailwind CSS",
  "Node.js, Express, MongoDB",
  "Python, Django, Flask",
  "Java, Spring Boot, Hibernate",
  "C#, .NET, Entity Framework",
  "PHP, Laravel, MySQL",
  "Ruby, Rails, PostgreSQL",
  "Go, Gin, PostgreSQL",
  "Docker, Kubernetes, AWS",
  "CI/CD, GitLab, Jenkins",
  "Testing, JUnit, Mockito",
  "API Design, REST, GraphQL",
  "Microservices, Event-Driven Architecture",
  "DevOps, Infrastructure as Code",
  "Agile, Scrum, Kanban",
  "Problem Solving, Critical Thinking, Creativity",
  "Communication, Teamwork, Leadership",
  "Time Management, Organization, Attention to Detail",
  "Adaptability, Learning Agility, Continuous Improvement",
  "Customer Service, Client Relations, Relationship Building",
  "Sales, Marketing, Business Development",
  "Financial Management, Budgeting, Accounting",
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
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <h1 className="text-5xl font-bold min-h-[4rem] flex items-center">
        <TypewriterText names={names} />
      </h1>
      <p className="mt-4 text-lg text-gray-400">
        English/Spanish Interpreter, Data Analyst, Full Stack Developer, Problem Solver
      </p>
    </div>
  )
}
