import Link from "next/link"

export default function ReturnPolicyPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Return Policy</h1>

      <div className="bg-secondary/30 rounded-lg p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Return Window</h2>
          <p className="text-muted-foreground">
            We accept returns within 7 days of delivery. To be eligible for a return, your item must be in the same
            condition that you received it, unworn, with tags attached, and in its original packaging.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Return Process</h2>
          <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
            <li>
              <strong className="text-foreground">Initiate a return:</strong> Contact our customer service team at
              <Link href="mailto:promodecouture@gmail.com" className="underline hover:text-primary ml-1">
                promodecouture@gmail.com
              </Link>{" "}
              or call us at +256 757 385 205 with your order number and the reason for your return.
            </li>
            <li>
              <strong className="text-foreground">Receive return authorization:</strong> We'll send you a return
              authorization and instructions on how to return your item.
            </li>
            <li>
              <strong className="text-foreground">Arrange pickup:</strong> We'll coordinate with our delivery team to
              collect the item from your location at no extra cost.
            </li>
            <li>
              <strong className="text-foreground">Refund processing:</strong> Once we receive and inspect the returned
              item, we'll process your refund. The refund will be issued to your original payment method within 5-7
              business days.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Return Conditions</h2>
          <p className="text-muted-foreground mb-4">To be eligible for a return, your item must:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Be returned within 7 days of delivery</li>
            <li>Be unworn and unused</li>
            <li>Have all original tags attached</li>
            <li>Be in its original packaging</li>
            <li>Show no signs of wear, washing, or alterations</li>
            <li>Be free from perfumes, deodorants, or other scents</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
          <p className="text-muted-foreground mb-4">The following items cannot be returned:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Items marked as "Final Sale" or "Non-Returnable"</li>
            <li>Intimates and undergarments</li>
            <li>Items that have been worn, washed, or altered</li>
            <li>Items with removed tags</li>
            <li>Gift cards</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Return Collection</h2>
          <p className="text-muted-foreground">
            We offer free return collection service within our delivery areas. Our team will coordinate with you to
            collect the item from your location at no additional cost. If the return is due to our error (you received
            an incorrect or defective item), we will prioritize the collection.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
          <p className="text-muted-foreground">
            Since our inventory consists of unique thrifted items, direct exchanges are not available. If you need a
            different size or item, please return your purchase for a refund and place a new order for the desired item.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Refunds</h2>
          <p className="text-muted-foreground">
            Once we receive and inspect your return, we'll send you an email to notify you that we've received your
            returned item. We'll also notify you of the approval or rejection of your refund. If approved, your refund
            will be processed, and a credit will automatically be applied to your original method of payment within 5-7
            business days.
          </p>
        </section>

        <div className="border-t border-gray-700 pt-6 mt-8">
          <p className="text-muted-foreground">
            If you have any questions about our return policy, please{" "}
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
