import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Award, BookOpen, Target, Calendar, Globe, Laptop, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const courses = [
  {
    id: 1,
    title: "Arduino Fundamentals",
    description: "Master the basics of Arduino programming and electronics",
    level: "Beginner",
    duration: "4 weeks",
    students: 150,
    rating: 4.8,
    price: "UGX 250,000",
    image: "/placeholder.svg?height=200&width=300",
    topics: ["Basic Electronics", "Arduino IDE", "Sensors & Actuators", "Project Building"],
    comingSoon: true,
  },
  {
    id: 2,
    title: "Raspberry Pi & IoT",
    description: "Build connected devices and IoT applications",
    level: "Intermediate",
    duration: "6 weeks",
    students: 89,
    rating: 4.9,
    price: "UGX 400,000",
    image: "/placeholder.svg?height=200&width=300",
    topics: ["Linux Basics", "Python Programming", "IoT Protocols", "Cloud Integration"],
    comingSoon: true,
  },
  {
    id: 3,
    title: "STM32 Advanced Programming",
    description: "Professional embedded systems development",
    level: "Advanced",
    duration: "8 weeks",
    students: 45,
    rating: 4.7,
    price: "UGX 600,000",
    image: "/placeholder.svg?height=200&width=300",
    topics: ["ARM Cortex-M", "Real-time OS", "Low-level Programming", "Debugging"],
    comingSoon: true,
  },
  {
    id: 4,
    title: "PCB Design Masterclass",
    description: "Learn professional PCB design from scratch",
    level: "Intermediate",
    duration: "5 weeks",
    students: 78,
    rating: 4.6,
    price: "UGX 350,000",
    image: "/placeholder.svg?height=200&width=300",
    topics: ["Schematic Design", "PCB Layout", "Manufacturing", "Testing"],
    comingSoon: true,
  },
]

const learningPath = [
  {
    step: 1,
    title: "Foundation",
    description: "Learn electronics basics and programming fundamentals",
    duration: "2-4 weeks",
    topics: ["Basic Electronics", "Programming Logic", "Safety Practices"],
  },
  {
    step: 2,
    title: "Hands-on Practice",
    description: "Build real projects with guidance from instructors",
    duration: "4-6 weeks",
    topics: ["Project Building", "Troubleshooting", "Best Practices"],
  },
  {
    step: 3,
    title: "Advanced Concepts",
    description: "Master complex topics and professional techniques",
    duration: "6-8 weeks",
    topics: ["Advanced Programming", "System Design", "Optimization"],
  },
  {
    step: 4,
    title: "Certification",
    description: "Complete capstone project and receive certification",
    duration: "2 weeks",
    topics: ["Final Project", "Presentation", "Industry Recognition"],
  },
]

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-yellow-500 text-black">Coming Soon</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Embedded Systems Training</h1>
            <p className="text-xl mb-8 text-emerald-100">
              Master embedded systems development with hands-on training from industry experts. Build real projects and
              gain practical skills that employers value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Calendar className="mr-2 h-5 w-5" />
                Get Notified When Available
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-emerald-600 hover:bg-white hover:text-blue-600" >
                Download Curriculum
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What to Expect from Our Training</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive training program is designed to take you from beginner to professional embedded systems
              developer with real-world experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Structured Learning</h3>
                <p className="text-gray-600 text-sm">
                  Progressive curriculum that builds knowledge step by step, from basics to advanced concepts.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Laptop className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Hands-on Projects</h3>
                <p className="text-gray-600 text-sm">
                  Build real embedded systems projects using industry-standard tools and components.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Expert Instructors</h3>
                <p className="text-gray-600 text-sm">
                  Learn from experienced engineers with years of industry experience and practical knowledge.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Industry Certification</h3>
                <p className="text-gray-600 text-sm">
                  Receive recognized certificates that demonstrate your skills to potential employers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Career Support</h3>
                <p className="text-gray-600 text-sm">
                  Get guidance on career paths, portfolio building, and job opportunities in the field.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-lg mb-3">Flexible Learning</h3>
                <p className="text-gray-600 text-sm">
                  Choose between in-person, online, or hybrid learning formats that fit your schedule.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Learning Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow our structured path from beginner to expert embedded systems developer
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {learningPath.map((step, index) => (
              <div key={step.step} className="flex gap-6 mb-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  {index < learningPath.length - 1 && <div className="w-px h-16 bg-gray-300 ml-6 mt-4"></div>}
                </div>
                <div className="flex-1">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        <Badge variant="outline">{step.duration}</Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.topics.map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upcoming Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive courses designed to build your expertise in embedded systems development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {course.comingSoon && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">Coming Soon</Badge>
                  )}
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    {course.level}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Course Topics:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.topics.slice(0, 2).map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {course.topics.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.topics.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-emerald-600">{course.price}</span>
                    <Button size="sm" disabled={course.comingSoon}>
                      {course.comingSoon ? "Notify Me" : "Enroll Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
            Join our waiting list to be the first to know when our training programs launch. Limited seats available for
            the first cohort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              <Mail className="mr-2 h-5 w-5" />
              Join Waiting List
            </Button>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-yellow-600 hover:bg-white hover:text-blue-600" >
                Contact for More Info
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
