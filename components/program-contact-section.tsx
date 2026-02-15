"use client"

import { FormEvent, useState } from "react"
import { Mail, MapPin, Phone } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Card, CardContent } from "@/components/ui/card"
import { contactFormSchema } from "@/lib/validation-schemas"
import { useToast } from "@/hooks/use-toast"

interface ProgramContactSectionProps {
  description: string
  iconBgClass: string
  iconClass: string
  submitButtonClass: string
}

export function ProgramContactSection({
  description,
  iconBgClass,
  iconClass,
  submitButtonClass,
}: ProgramContactSectionProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const setFieldValue = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatusMessage(null)

    const parsed = contactFormSchema.safeParse(formData)
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof typeof formData, string>> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof typeof formData
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      toast({
        variant: "destructive",
        title: "Form validation failed",
        description: "Please correct the highlighted fields and try again.",
      })
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        const message = data.error || "Failed to submit form"
        setStatusMessage(message)
        toast({
          variant: "destructive",
          title: "Unable to send message",
          description: message,
        })
        return
      }

      const successMessage = "Message sent successfully. We'll get back to you shortly."
      setStatusMessage(successMessage)
      setFormData({ name: "", email: "", subject: "", message: "" })
      toast({
        title: "Message sent",
        description: successMessage,
      })
    } catch {
      const message = "Network error. Please try again."
      setStatusMessage(message)
      toast({
        variant: "destructive",
        title: "Request failed",
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 bg-gray-50" id="contact">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <AnimatedSection variant="fadeRight">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter text-gray-900">Get In Touch</h2>
              <p className="text-gray-600">{description}</p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className={`${iconBgClass} p-2 rounded-full`}>
                    <Mail className={`h-5 w-5 ${iconClass}`} />
                  </div>
                  <div>
                    <h4 className="font-medium">Email Us</h4>
                    <p className="text-sm text-gray-500">office@fossap.in</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className={`${iconBgClass} p-2 rounded-full`}>
                    <Phone className={`h-5 w-5 ${iconClass}`} />
                  </div>
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-sm text-gray-500">+91 94944 63840</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className={`${iconBgClass} p-2 rounded-full`}>
                    <MapPin className={`h-5 w-5 ${iconClass}`} />
                  </div>
                  <div>
                    <h4 className="font-medium">Office</h4>
                    <p className="text-sm text-gray-500">Foss andhra, Yesj centre for excellence, Vijayawada 520008</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection variant="fadeLeft">
            <Card>
              <CardContent className="pt-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(event) => setFieldValue("name", event.target.value)}
                        aria-invalid={!!errors.name}
                        required
                      />
                      {errors.name ? <p className="text-xs text-red-600">{errors.name}</p> : null}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={(event) => setFieldValue("email", event.target.value)}
                        aria-invalid={!!errors.email}
                        required
                      />
                      {errors.email ? <p className="text-xs text-red-600">{errors.email}</p> : null}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={(event) => setFieldValue("subject", event.target.value)}
                      aria-invalid={!!errors.subject}
                      required
                    />
                    {errors.subject ? <p className="text-xs text-red-600">{errors.subject}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="w-full px-3 py-2 border rounded-md min-h-[120px]"
                      placeholder="Your message"
                      value={formData.message}
                      onChange={(event) => setFieldValue("message", event.target.value)}
                      aria-invalid={!!errors.message}
                      required
                    />
                    {errors.message ? <p className="text-xs text-red-600">{errors.message}</p> : null}
                  </div>
                  {statusMessage ? <p className="text-sm text-muted-foreground">{statusMessage}</p> : null}
                  <AnimatedButton className={`${submitButtonClass} w-full`} disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </AnimatedButton>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
