import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEEEEE]">
      <div className="text-center max-w-md px-8">
        <div className="mb-8 flex justify-center">
            <div className="relative">
              <Image
                src="/EchoLearnLogo.png"
                alt="EchoLearn logo"
                width={192}
                height={192}
                className="object-contain"
              />
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
