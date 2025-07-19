"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, Truck } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("https://formspree.io/f/mpwdqnbn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        const data = await response.json()
        setError(data.error || "There was an error submitting the form. Please try again.")
      }
    } catch (err) {
      setError("There was an error submitting the form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-lg mb-8">
            Have a question about a specific item? Want to learn more about our sourcing process? Or maybe you're
            interested in selling your pre-loved clothing to us? We'd love to hear from you! We offer convenient
            door-to-door delivery for all orders.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Email Us</h3>
                <p className="text-muted-foreground">promodecouture@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Call Us</h3>
                <p className="text-muted-foreground">
                  +256 757 385 205
                  <br />
                  0789 548 006
                  <br />
                  Monday-Friday: 9am-6pm EAT
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Truck className="w-6 h-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Delivery Service</h3>
                <p className="text-muted-foreground">
                  We offer door-to-door delivery
                  <br />
                  Fast and reliable service
                  <br />
                  Contact us for delivery areas
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="font-semibold text-lg mb-4">Business Hours</h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>By Appointment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 p-8 rounded-lg">
          {isSubmitted ? (
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
              <p className="mb-6">
                Your message has been sent successfully. We'll get back to you as soon as possible.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formState.name} onChange={handleChange} required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" value={formState.subject} onChange={handleChange} required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
