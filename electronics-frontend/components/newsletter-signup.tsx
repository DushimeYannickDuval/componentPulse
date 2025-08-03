import { Button } from "@/components/ui/button"

export function NewsletterSignup() {
  return (
    <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Coming Soon: Embedded Systems Training</h2>
        <p className="text-xl mb-8 text-emerald-100 max-w-3xl mx-auto">
          Master embedded systems design with our comprehensive training programs. From beginner to advanced levels,
          learn from industry experts and get hands-on experience with real projects.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Beginner Courses</h3>
            <p className="text-emerald-100">Arduino programming, basic electronics, and circuit design</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Advanced Training</h3>
            <p className="text-emerald-100">ARM Cortex, RTOS, IoT development, and professional projects</p>
          </div>
          <div className="bg-white/10 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Certification</h3>
            <p className="text-emerald-100">Industry-recognized certificates and portfolio development</p>
          </div>
        </div>
        <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
          Get Notified When Available
        </Button>
      </div>
    </section>
  )
}
