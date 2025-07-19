import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="bg-secondary/30 rounded-lg p-8 space-y-6">
        <section>
          <p className="text-muted-foreground mb-6">
            At PROMODE, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you visit our website or make a purchase.
          </p>
          <p className="text-muted-foreground">
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please
            do not access the site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Personal Information</h3>
              <p className="text-muted-foreground mb-2">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Register on our website</li>
                <li>Place an order</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us</li>
                <li>Participate in promotions or surveys</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                This information may include your name, email address, postal address, phone number, and payment
                information.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Automatically Collected Information</h3>
              <p className="text-muted-foreground mb-2">
                When you visit our website, we may automatically collect certain information about your device,
                including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Operating system</li>
                <li>Referring URLs</li>
                <li>Time spent on pages</li>
                <li>Pages visited</li>
                <li>Other browsing information</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="text-muted-foreground mb-2">
            We may use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders, products, and services</li>
            <li>Provide customer support</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Conduct research and analysis</li>
            <li>Prevent fraudulent transactions</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Sharing Your Information</h2>
          <p className="text-muted-foreground mb-2">We may share your information with:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Service providers who help us operate our business (payment processors, delivery companies, etc.)</li>
            <li>Marketing partners (with your consent)</li>
            <li>Legal authorities when required by law</li>
            <li>In connection with a business transfer (merger, acquisition, etc.)</li>
          </ul>
          <p className="text-muted-foreground mt-4">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
          <p className="text-muted-foreground mb-4">
            We use cookies and similar tracking technologies to track activity on our website and hold certain
            information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
          </p>
          <p className="text-muted-foreground">
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if
            you do not accept cookies, you may not be able to use some portions of our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="text-muted-foreground">
            We implement appropriate technical and organizational measures to protect the security of your personal
            information. However, please be aware that no method of transmission over the internet or electronic storage
            is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="text-muted-foreground mb-2">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to request deletion of your information</li>
            <li>The right to restrict processing of your information</li>
            <li>The right to data portability</li>
            <li>The right to object to processing</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
          <p className="text-muted-foreground">
            Our website is not intended for children under 13 years of age. We do not knowingly collect personal
            information from children under 13. If you are a parent or guardian and believe your child has provided us
            with personal information, please contact us, and we will delete such information from our records.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
          <p className="text-muted-foreground">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy
            Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <Link href="mailto:promodecouture@gmail.com" className="underline hover:text-primary">
              promodecouture@gmail.com
            </Link>
            .
          </p>
        </section>

        <div className="border-t border-gray-700 pt-6 mt-8">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  )
}
