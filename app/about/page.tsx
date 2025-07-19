import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8"></h1>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Our Story</h1>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <p className="text-lg mb-6">
            PROMODE was born from a passion for sustainable fashion and a desire to give pre-loved clothing a second
            life. Founded in 2023, our mission is to reduce fashion waste while helping people express their unique
            style through carefully curated vintage and second-hand pieces.
          </p>
          <p className="text-lg mb-6">
            Each item in our collection is hand-selected for its quality, character, and potential to become a cherished
            part of someone else's wardrobe. We believe that fashion should be both sustainable and accessible, which is
            why we offer a diverse range of styles at affordable prices.
          </p>
          <p className="text-lg">
            By choosing second-hand clothing, you're not just making a style statement – you're also making a positive
            impact on the environment by reducing waste and extending the lifecycle of clothing items.
          </p>
        </div>

        {/* Video with fallback image */}
        <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
          <video
            src="https://res.cloudinary.com/dzvwd8flx/video/upload/v1745438661/wxh5kzzwxqfrfyon5bm9.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full rounded-lg pointer-events-none"
          />
          <img src="https://v1.pinimg.com/videos/iht/720p/2a/c9/0e/2ac90e4f448de9cad72be118ebd66a7b.mp4" />
        </div>
      </div>

      <div className="text-center bg-secondary/50 p-10 rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to discover unique pieces?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Browse our collection of carefully curated thrifted clothing and find pieces that speak to your personal
          style.
        </p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/shop">Shop Now</Link>
        </Button>
      </div>
    </div>
  )
}
