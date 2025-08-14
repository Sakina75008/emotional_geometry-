import Image from "next/image"

export default function Header() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Image src="/images/vexaeg-header-logo.png" alt="VexaEG" width={40} height={40} className="rounded-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                VexaEG
              </h1>
              <p className="text-sm text-muted-foreground">Emotional Geometry AI</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-4">
              <span className="text-sm font-medium text-foreground/80">Analysis Dashboard</span>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
