import Link from "next/link"
import { Accordion, AccordionItem } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8"></h1>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Frequently Asked Questions</h1>

      <div className="space-y-8">
        <div className="bg-secondary/30 rounded-lg p-8">
          <Accordion className="space-y-4">
            <AccordionItem title="How do I know what size to order?">
              <p>
                We provide detailed measurements for each item in the product description. Since these are thrifted
                items, sizes may vary from standard sizing. We recommend checking your own measurements against those
                listed. If you're still unsure, feel free to{" "}
                <Link href="/contact" className="underline hover:text-primary">
                  contact us
                </Link>{" "}
                for assistance.
              </p>
            </AccordionItem>

            <AccordionItem title="Are the clothes cleaned before shipping?">
              <p>
                Yes, all items are thoroughly cleaned and inspected before being listed on our site. We ensure each
                piece is in excellent condition before shipping it to you.
              </p>
            </AccordionItem>

            <AccordionItem title="How long will shipping take?">
              <p>
                Domestic orders typically take 3-5 business days to arrive. International shipping can take 7-14
                business days, depending on the destination. You'll receive a tracking number once your order ships.
              </p>
            </AccordionItem>

            <AccordionItem title="What is your return policy?">
              <p>
                We accept returns within 7 days of delivery, provided the items are in their original condition and show
                no signs of wear. For more details, please see our{" "}
                <Link href="/policies/returns" className="underline hover:text-primary">
                  Return Policy
                </Link>
                .
              </p>
            </AccordionItem>

            <AccordionItem title="Do you ship internationally?">
              <p>
                Yes, we ship to most countries worldwide. International shipping rates vary by location and will be
                calculated at checkout.
              </p>
            </AccordionItem>

            <AccordionItem title="How can I use the Style Assistant?">
              <p>
                Our Style Assistant (Style-GPT) can help you find the perfect outfit or styling advice. Simply click on
                the chat icon in the bottom right corner of the screen or visit the{" "}
                <Link href="/chatbot" className="underline hover:text-primary">
                  Style Assistant page
                </Link>
                . Tell it what you're looking for, and it will provide personalized recommendations.
              </p>
            </AccordionItem>

            <AccordionItem title="Can I sell my clothes to The Akaal Thrifts?">
              <p>
                We're always looking for unique, quality pieces to add to our collection. If you have items you'd like
                to sell, please{" "}
                <Link href="/contact" className="underline hover:text-primary">
                  contact us
                </Link>{" "}
                with photos and details of the items.
              </p>
            </AccordionItem>

            <AccordionItem title="How do I care for vintage clothing?">
              <p>
                We recommend gentle hand washing or dry cleaning for most vintage items. Always check the care
                instructions provided with each item. For delicate pieces, cold water hand washing and air drying is
                usually safest.
              </p>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="text-center bg-secondary/30 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
          <p className="mb-6 text-muted-foreground">
            We're here to help! Reach out to our team for personalized assistance.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
