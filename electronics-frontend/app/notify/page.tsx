// app/notify/page.tsx (or pages/notify.tsx if using Pages Router)
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

export default function NotifyPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) {
      toast.error("Please fill in all fields")
      return
    }

    // Fake submission logic (replace with actual API call)
    console.log("Newsletter sign-up:", { name, email })

    // Example: you could POST to an endpoint like /api/newsletter
    // await fetch("/api/newsletter", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, email })
    // })

    toast.success("Thanks for subscribing! You’ll hear from us soon.")
    setEmail("")
    setName("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <ToastContainer />
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-emerald-600">Stay in the Loop</h1>
        <p className="text-gray-600 mb-6 text-center">
          Subscribe to our newsletter to get updates about Embedded Systems Training and exclusive product offers.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  )
}
