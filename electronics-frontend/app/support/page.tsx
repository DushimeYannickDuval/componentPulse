import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Phone,
  MessageSquare,
  Mail,
  FileText,
  Download,
  Video,
  BookOpen,
  Users,
  Settings,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept MTN Mobile Money, Airtel Money, and Pay on Dellivery. All payments are processed securely through our encrypted payment gateway.",
  },
  {
    question: "What is your shipping policy?",
    answer:
      "We offer free shipping within Kampala for orders above UGX 500,000. Standard delivery takes 2-3 business days within Kampala and 3-5 days to other parts of Uganda. Express delivery is available for urgent orders.",
  },
  {
    question: "Do you provide technical support for products?",
    answer:
      "Yes! We provide comprehensive technical support including setup guides, troubleshooting, code examples, and direct support from our engineering team. Support is available via email, phone, and live chat.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for unused items in original packaging. Defective items can be returned within 1 year of purchase. Please contact our support team to initiate a return.",
  },
  {
    question: "Do you offer bulk discounts?",
    answer:
      "Yes, we offer competitive pricing for bulk orders. Discounts start at 5% for orders above UGX 500,000 and can go up to 20% for large institutional orders. Contact our sales team for a custom quote.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a tracking number via email and SMS. You can track your package on our website or through our delivery partner's tracking system.",
  },
  {
    question: "Do you provide custom solutions?",
    answer:
      "Our engineering team can design custom PCBs, develop firmware, and create complete embedded solutions for your specific requirements. Contact us to discuss your project.",
  },
  {
    question: "What warranty do you offer on products?",
    answer:
      "Most products come with manufacturer warranties ranging from 6 months to 2 years. We also provide our own warranty for products we manufacture. Check individual product pages for specific warranty information.",
  },
]

const resources = [
  {
    title: "Arduino Getting Started Guide",
    description: "Complete guide to setting up and programming your first Arduino project",
    type: "PDF Guide",
    icon: FileText,
    fileUrl: "/pdfs/Arduino_ Getting Started Guide.pdf",
  },
  {
    title: "Raspberry Pi Setup Tutorial",
    description: "Step-by-step video tutorial for Raspberry Pi initial setup",
    type: "Video Tutorial",
    icon: Video,
    downloadUrl: "#",
  },
  {
    title: "ESP32 Programming Examples",
    description: "Collection of code examples for ESP32 projects",
    type: "Code Examples",
    icon: Download,
    downloadUrl: "#",
  },
  {
    title: "Sensor Interfacing Guide",
    description: "How to connect and program various sensors",
    type: "Technical Guide",
    icon: BookOpen,
    downloadUrl: "#",
  },
  {
    title: "PCB Design Basics",
    description: "Introduction to PCB design principles and best practices",
    type: "Learning Material",
    icon: FileText,
    downloadUrl: "#",
  },
  {
    title: "Troubleshooting Checklist",
    description: "Common issues and solutions for embedded systems",
    type: "Quick Reference",
    icon: Settings,
    downloadUrl: "#",
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Support Center</h1>
            <p className="text-xl mb-8 text-blue-100">
              Get the help you need to succeed with your embedded systems projects. Our comprehensive support includes
              technical assistance, documentation, and community resources.
            </p>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Can We Help You?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the support option that best fits your needs. Our team is here to help you every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
<Card className="text-center hover:shadow-lg transition-shadow">
  <CardContent className="p-6">
    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <MessageSquare className="h-8 w-8 text-green-600" />
    </div>
    <h3 className="font-semibold text-lg mb-2">WhatsApp Chat</h3>
    <p className="text-gray-600 text-sm mb-2">
      +256 790 270 840
    </p>

    <a
      href="https://wa.me/+256 790 270 840"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Badge className="bg-green-100 text-green-600 cursor-pointer hover:underline">
        Chat on WhatsApp
      </Badge>
    </a>

    <p className="text-gray-600 text-sm mt-2">
      Mon–Fri: 8AM–6PM
    </p>
  </CardContent>
</Card>


<Card className="text-center hover:shadow-lg transition-shadow">
  <CardContent className="p-6">
    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <Phone className="h-8 w-8 text-blue-600" />
    </div>
    <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
    <p className="text-gray-600 text-sm mb-4">Call us for immediate technical assistance</p>
    
    <a href="tel:+256 790 270 840">
      <Badge className="bg-blue-300 text-blue-600 cursor-pointer hover:underline">
        +256 790 270 840
      </Badge>
    </a>
     <p className="text-gray-600 text-sm mt-2">
      Mon–Fri: 8AM–6PM
    </p>
  </CardContent>
</Card>


<Card className="text-center hover:shadow-lg transition-shadow">  <CardContent className="p-6">
    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <Mail className="h-8 w-8 text-purple-600" />
    </div>
    <h3 className="font-semibold text-lg mb-2">Email Support</h3>
    <p className="text-gray-600 text-sm mb-2">
      componentpulse@gmail.com
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
    
    <p className="text-gray-600 text-sm mt-2">
      Mon–Fri: 8AM–6PM
    </p>
  </CardContent>
</Card>


<Card className="text-center hover:shadow-lg transition-shadow">
  <CardContent className="p-6">
    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <Users className="h-8 w-8 text-orange-600" />
    </div>
    <h3 className="font-semibold text-lg mb-2">Community Forum</h3>
    <p className="text-gray-600 text-sm mb-4">Connect with other developers and experts</p>

    <a
      href="https://forum.arduino.cc"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Badge className="bg-orange-100 text-orange-600 cursor-pointer hover:underline">
        Join Arduino Forum
      </Badge>
    </a>
        <p className="text-gray-600 text-sm mt-2">
      Anytime
    </p>
  </CardContent>
</Card>

          </div>
        </div>
      </section>

      {/* Support Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="faq" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="faq">Questions Asked</TabsTrigger>
              <TabsTrigger value="resources">Resources & Downloads</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Find quick answers to common questions about our products and services.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
{resources.map((resource, index) => (
  <Card key={index} className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="bg-blue-100 p-3 rounded-lg">
          <resource.icon className="h-6 w-6 text-blue-600" />
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">{resource.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{resource.description}</p>

          <div className="flex items-center justify-between">
            {/* Type Badge as View Link */}
            <Link
              href={resource.fileUrl || resource.downloadUrl}
              /*target="_blank" # responsible for new tab for view*/ 
              rel="noopener noreferrer"
            >
              <Badge variant="outline" className="hover:underline cursor-pointer">
                {resource.type}
              </Badge>
            </Link>

            {/* Download Link */}
            <a
              href={resource.fileUrl || resource.downloadUrl}
              download
              className="text-sm text-green-600 hover:underline flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </a>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
))}

              </div>

              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Looking for More Resources?</h3>
                    <p className="text-gray-600 mb-4">
                      Visit our knowledge base for comprehensive documentation, tutorials, and technical articles.
                    </p>
<Button asChild>
  <Link href="/knowledge-base">
    <ExternalLink className="h-4 w-4 mr-2" />
    Visit Knowledge Base
  </Link>
</Button>

                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Multiple ways to reach our support team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-gray-600">+256 754468261</p>
                        <a href="tel:+256754468261">
                        <Badge className="bg-blue-300 text-blue-600 cursor-pointer hover:underline">
                        +256 754468261
                        </Badge>
                        </a>
                        <p className="text-sm text-gray-500">Mon-Fri: 8AM-6PM</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-gray-600">support@embeddedsystems.ug</p>
    <a
      href="https://mail.google.com/mail/?view=cm&fs=1&to=wayneredemption@gmail.com"
      target="_blank"
      rel="noopener noreferrer">
      <Badge className="bg-purple-100 text-purple-800 cursor-pointer hover:underline">
        Email Us for Support
      </Badge>
    </a>
</div>
</div>

                    <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                <p className="font-medium">WhatsApp Chat</p>
                <p className="text-gray-600">+256 754468261</p>
    <a
      href="https://wa.me/+256754468261"
      target="_blank"
      rel="noopener noreferrer">
      <Badge className="bg-green-100 text-green-600 cursor-pointer hover:underline">
        Chat on WhatsApp
      </Badge>
    </a>
    <p className="text-sm text-gray-500">Mon-Fri: 8AM-6PM</p>
</div>
</div>
</CardContent>
</Card>


                <Card>
                  <CardHeader>
                    <CardTitle>Support Levels</CardTitle>
                    <CardDescription>Different support options for different needs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Basic Support (Free)</span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1 ml-7">
                        <li>• Email support</li>
                        <li>• Documentation access</li>
                        <li>• Community forum</li>
                        <li>• Basic troubleshooting</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Priority Support</span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1 ml-7">
                        <li>• Phone & chat support</li>
                        <li>• Faster response times</li>
                        <li>• Technical consultations</li>
                        <li>• Custom code review</li>
                      </ul>
                      <Button size="sm" variant="outline" className="mt-3">
                        Learn More
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Enterprise Support</span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1 ml-7">
                        <li>• Dedicated support engineer</li>
                        <li>• On-site consultations</li>
                        <li>• Custom development</li>
                        <li>• Training sessions</li>
                      </ul>
                      <Link href="/contact">
                        <Button size="sm" variant="outline" className="mt-3">
                          Contact Sales
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  )
}
