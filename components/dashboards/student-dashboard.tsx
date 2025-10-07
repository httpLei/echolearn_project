"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

const classCards = [
  {
    title: "CSIT327",
    description: "Information Management",
    teacher: "Joemarie C. Amparo",
    color: "bg-[#FFBC4C]",
    textColor: "text-[#1D1616]",
  },
  {
    title: "ES038",
    description: "Technopreneurship",
    teacher: "Jurydel G. Rama",
    color: "bg-[#8E1616]",
    textColor: "text-white",
  },
  {
    title: "IT317",
    description: "Project Management",
    teacher: "Joemarie C. Amparo",
    color: "bg-[#FFBC4C]",
    textColor: "text-[#1D1616]",
  },
  {
    title: "CSIT340",
    description: "Industry Elective",
    teacher: "Eugene C. Busico",
    color: "bg-[#D0D0D0]",
    textColor: "text-[#1D1616]",
  },
  {
    title: "CSIT321",
    description: "Application Development",
    teacher: "Leah V. Barbaso",
    color: "bg-[#8E1616]",
    textColor: "text-white",
  },
  {
    title: "IT365",
    description: "Data Analytics",
    teacher: "Erica Jean S. Abadinas",
    color: "bg-[#FFBC4C]",
    textColor: "text-[#1D1616]",
  },
  {
    title: "RIZAL031",
    description: "Life and Works of Rizal",
    teacher: "Jhemi J. Pelayo",
    color: "bg-[#D0D0D0]",
    textColor: "text-[#1D1616]",
  },
  
]

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-[#1D1616]">My Classes</h1>
        <p className="text-[#666666]">Select a class to view assignments, materials, and announcements.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classCards.map((card) => (
          <Card
            key={card.title}
            className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-[#CCCCCC] hover:border-[#8E1616]"
          >
            <CardHeader>
              <div className={`h-24 w-full rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                <BookOpen className={`h-12 w-12 ${card.textColor}`} />
              </div>
              <CardTitle className="text-xl text-[#1D1616]">{card.title}</CardTitle>
              <CardDescription className="text-base text-[#666666]">{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#666666]">{card.teacher}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
