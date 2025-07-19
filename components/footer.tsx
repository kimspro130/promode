import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-3 md:space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl md:text-2xl font-bold text-green-400">PROMODE</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Discover premium thrift fashion that tells a story. Sustainable style meets modern elegance with
              door-to-door delivery.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/promodecouture"
                className="text-gray-400 hover:text-green-400 transition-colors touch-target p-2 -m-2"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a
                href="https://instagram.com/promodecouture"
                className="text-gray-400 hover:text-green-400 transition-colors touch-target p-2 -m-2"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a
                href="https://x.com/ProModeCouture"
                className="text-gray-400 hover:text-green-400 transition-colors touch-target p-2 -m-2"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5 md:h-6 md:w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/policies/shipping"
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-gray-400 text-sm">promodecouture@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400" />
                <div className="text-gray-400 text-sm">
                  <div>+256 757 385 205</div>
                  <div>0789 548 006</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; 2024 PROMODE. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Secure payments</span>
            <span className="text-gray-400 text-sm">Door-to-door delivery</span>
            <span className="text-gray-400 text-sm">Easy returns</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
