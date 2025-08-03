import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award, Phone, Mail, Cpu, Shield, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const values = [
  {
    icon: Target,
    title: "Quality First",
    description: "We source only genuine, high-quality components from trusted manufacturers.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description: "Our customers' success is our priority. We provide expert support and guidance.",
  },
  {
    icon: Award,
    title: "Innovation",
    description: "We stay at the forefront of technology to bring you the latest solutions.",
  },
  {
    icon: Shield,
    title: "Reliability",
    description: "Count on us for consistent supply, competitive pricing, and dependable service.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">About componentPulse</h1>
            <p className="text-xl mb-8 text-blue-100">
              Your trusted partner in electronic components and embedded systems development. We're
              passionate about empowering innovation across Uganda and East Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
              </Link>
              
              <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-emerald-600 hover:bg-white hover:text-blue-600" >
                View Products
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg mb-6">
                To democratize access to high-quality electronic components and embedded systems knowledge across Uganda
                and East Africa, empowering innovators, students, and professionals to build the technology solutions of
                tomorrow.
              </p>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-gray-600 text-lg">
                To become the leading hub for embedded systems education and components supply in East Africa, fostering
                a thriving ecosystem of innovation and technological advancement.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/images/about.jpg?"
                alt="Our Mission"
                width={640}
                height={450}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape our relationships with customers, partners, and the
              community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions about our products or services? We're here to help you succeed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Online Store</h3>
                <p className="text-gray-600">
                  Serving customers across Uganda
                  <br />
                  Online orders and delivery available
                </p>
              <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-gray text-emerald-600 hover:bg-white hover:text-blue-600" >
                View Products
              </Button>
              </Link>

              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                <p className="text-gray-600">
                  +256 790 270 840
                  <br />
                  Mon-Fri: 8AM-6PM
                </p>

    <a href="tel:+256 754468261">
      <Badge className="bg-blue-300 text-blue-600 cursor-pointer hover:underline">
        +256 790 270 840
      </Badge>
    </a>

              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                <p className="text-gray-600">
                  componentpulse@gmail.com
                  <br />
                  support@componentPulse.ug
                 </p>
    <a
      href="https://mail.google.com/mail/?view=cm&fs=1&to=componentpulse@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Badge className="bg-purple-100 text-purple-800 cursor-pointer hover:underline">
        Email Us for Support
      </Badge>
    </a>

                
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Browse our extensive catalog of electronic components or get in touch for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Cpu className="mr-2 h-5 w-5" />
                Browse Products
              </Button>
            </Link>
            <Link href="/support">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-blue-500 hover:bg-white hover:text-green-600"
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
