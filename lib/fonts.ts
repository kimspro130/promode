import { Inter } from "next/font/google"

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

// We'll use system fonts instead of the custom font to avoid build errors
export const customFont = {
  className: "font-bold uppercase tracking-wider",
  variable: "--font-custom",
}
