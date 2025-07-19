"use client"

import Script from "next/script"

const GA_TRACKING_ID = "G-LJXNCRZ4PK"

export default function GoogleAnalytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}

// Helper function to track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Helper function to track page views
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Helper function to track purchases
export const trackPurchase = (transactionId: string, value: number, currency = "INR", items: any[]) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", "purchase", {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    })
  }
}

// Helper function to track add to cart
export const trackAddToCart = (currency = "INR", value: number, items: any[]) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", "add_to_cart", {
      currency: currency,
      value: value,
      items: items,
    })
  }
}

// Helper function to track begin checkout
export const trackBeginCheckout = (currency = "INR", value: number, items: any[]) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", "begin_checkout", {
      currency: currency,
      value: value,
      items: items,
    })
  }
}
