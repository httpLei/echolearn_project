import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEEEEE]">
      <div className="text-center max-w-md px-8">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-48 h-48 bg-white rounded-3xl flex items-center justify-center shadow-lg border-2 border-[#CCCCCC]">
              <Lightbulb className="w-24 h-24 text-[#FFBC4C] fill-[#FFBC4C]" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-[#CCCCCC] rounded-full" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-2 bg-[#D0D0D0] rounded-full" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-[#1D1616]">Welcome to EchoLearn</h1>

        <div className="space-y-3">
          <Link href="/login" className="block">
            <Button className="w-full h-12 text-lg bg-[#8E1616] hover:bg-[#561818] text-white">Sign In</Button>
          </Link>
          <Link href="/signup" className="block">
            <Button
              className="w-full h-12 text-lg bg-[#c28f3a] hover:bg-[#9a7639] text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
