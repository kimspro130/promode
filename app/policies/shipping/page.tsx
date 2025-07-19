import Link from "next/link"

export default function ShippingPolicyPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Delivery Policy</h1>

      <div className="bg-secondary/30 rounded-lg p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
          <p className="text-muted-foreground">
            All orders are processed within 1-2 business days after receiving your order confirmation. Orders placed on
            weekends or holidays will be processed on the next business day.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Delivery Service</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Door-to-Door Delivery</h3>
              <p className="text-muted-foreground mb-2">
                We offer convenient door-to-door delivery service to bring your fashion finds directly to you:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Standard Delivery: 2-3 business days within Kampala</li>
                <li>Express Delivery: Same day or next day delivery (available for an additional fee)</li>
                <li>Extended Areas: 3-5 business days for locations outside Kampala</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Delivery Areas</h3>
              <p className="text-muted-foreground">
                We currently deliver to most areas within Uganda. Contact us at{" "}
                <Link href="tel:+256757385205" className="underline hover:text-primary">
                  +256 757 385 205
                </Link>{" "}
                to confirm if we deliver to your specific location.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Payment Methods</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Available Payment Options</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong>Cash on Delivery:</strong> Pay when your order is delivered to your doorstep
                </li>
                <li>
                  <strong>Mobile Money:</strong> MTN Mobile Money, Airtel Money (payment instructions provided after
                  order)
                </li>
                <li>
                  <strong>Bank Transfer:</strong> Direct bank transfer (details provided after order confirmation)
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Delivery Rates</h2>
          <p className="text-muted-foreground mb-4">
            Delivery rates are calculated based on your location and the delivery method selected. All prices are in
            Ugandan Shillings (UGX).
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Standard Delivery Rates</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Orders over UGX 150,000: Free standard delivery</li>
                <li>Orders under UGX 150,000: UGX 15,000 delivery fee</li>
                <li>Express delivery: Additional UGX 25,000</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Extended Areas</h3>
              <p className="text-muted-foreground">
                Delivery rates for locations outside Kampala vary by distance and will be calculated at checkout or
                confirmed when you contact us. All rates are quoted in UGX.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
          <p className="text-muted-foreground">
            You will receive a confirmation call within 2 hours of placing your order. Our delivery team will contact
            you to coordinate the best time for delivery to ensure you're available to receive your order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Delivery Process</h2>
          <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
            <li>Order confirmation and processing (1-2 business days)</li>
            <li>Confirmation call within 2 hours of order placement</li>
            <li>Delivery team contacts you to schedule delivery</li>
            <li>Door-to-door delivery at your preferred time</li>
            <li>Payment collection (if cash on delivery selected)</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Delivery Delays</h2>
          <p className="text-muted-foreground">
            While we strive to deliver all orders within the estimated timeframes, occasionally delays may occur due to
            circumstances beyond our control, such as weather conditions, traffic, or other unforeseen circumstances. We
            appreciate your understanding and will keep you informed of any delays.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact for Delivery</h2>
          <p className="text-muted-foreground">
            For any delivery-related questions or to arrange special delivery instructions, please contact us:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
            <li>Phone: +256 757 385 205 or 0789 548 006</li>
            <li>Email: promodecouture@gmail.com</li>
          </ul>
        </section>

        <div className="border-t border-gray-700 pt-6 mt-8">
          <p className="text-muted-foreground">
            If you have any questions about our delivery policy, please{" "}
            <Link href="/contact" className="underline hover:text-primary">
              contact us
            </Link>
            .
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  )
}
