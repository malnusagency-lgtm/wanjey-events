'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedSection from "@/components/AnimatedSection";
import { MapPin, Phone, Mail, MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  budget: string;
  message: string;
};

const WHATSAPP_NUMBER = "254790381039";

function buildWhatsAppUrl(data: FormData): string {
  const lines = [
    `Hi Wanjey Events! 👋`,
    ``,
    `*Name:* ${data.name}`,
    data.company ? `*Company:* ${data.company}` : null,
    `*Email:* ${data.email}`,
    data.phone ? `*Phone:* ${data.phone}` : null,
    data.service ? `*Service Needed:* ${data.service}` : null,
    data.date ? `*Event Date:* ${data.date}` : null,
    data.budget ? `*Budget:* ${data.budget}` : null,
    ``,
    data.message ? `*Message:*\n${data.message}` : null,
    ``,
    `Looking forward to hearing from you!`,
  ].filter(Boolean).join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
}

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "", company: "", email: "", phone: "",
    service: "", date: "", budget: "", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitted(true);
    const url = buildWhatsAppUrl(form);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const update = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <section className="py-8 md:py-16">
      <div className="container">
        <AnimatedSection className="text-center">
          <p className="section-label">Contact</p>
          <h1 className="section-heading">Let&apos;s Plan Your Next Event</h1>
        </AnimatedSection>

        <div className="mt-8 md:mt-10 grid gap-12 lg:grid-cols-3 lg:gap-16">
          <AnimatedSection className="lg:col-span-2">
            {submitted ? (
              <div className="glass-card flex flex-col items-center p-16 text-center">
                <CheckCircle2 className="h-10 w-10 text-accent" />
                <h3 className="mt-5 font-serif text-2xl font-bold">Opening WhatsApp…</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Your inquiry details are pre-filled in WhatsApp. We&apos;ll respond within 24 hours.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="mt-6 font-sans"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Full Name *</Label>
                  <Input required value={form.name} onChange={update("name")} placeholder="Your name" className="h-11 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Company Name</Label>
                  <Input value={form.company} onChange={update("company")} placeholder="Company" className="h-11 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email *</Label>
                  <Input required type="email" value={form.email} onChange={update("email")} placeholder="you@company.co.ke" className="h-11 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phone</Label>
                  <Input type="tel" value={form.phone} onChange={update("phone")} placeholder="+254 790 381039" className="h-11 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Service Needed</Label>
                  <Select onValueChange={(val) => setForm((prev) => ({ ...prev, service: val }))}>
                    <SelectTrigger className="h-11 rounded-lg"><SelectValue placeholder="Select a service" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corporate Events">Corporate Events</SelectItem>
                      <SelectItem value="Brand Activations">Brand Activations</SelectItem>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="Event Amplification">Event Amplification</SelectItem>
                      <SelectItem value="Custom Package">Custom Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Event Date</Label>
                  <Input type="date" value={form.date} onChange={update("date")} className="h-11 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Estimated Budget</Label>
                  <Input value={form.budget} onChange={update("budget")} placeholder="e.g. KES 500,000" className="h-11 rounded-lg" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-medium">Message</Label>
                  <Textarea rows={4} value={form.message} onChange={update("message")} placeholder="Tell us about your event vision…" className="rounded-lg" />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] px-10">
                    Send via WhatsApp
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Your details will be pre-filled in a WhatsApp message to us.
                  </p>
                </div>
              </form>
            )}
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="space-y-3">
              <div className="glass-card p-6">
                <h3 className="font-serif text-lg font-semibold">Contact Details</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-accent" /> Nairobi, Kenya
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 text-accent" /> +254 790 381039
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-accent" /> hello@misswanjey.co.ke
                  </li>
                </ul>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Miss%20Wanjey%2C%20I'd%20like%20to%20inquire%20about%20your%20event%20services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card flex items-center gap-4 p-6 block"
              >
                <MessageCircle className="h-5 w-5 text-accent shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Chat on WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Quick response guaranteed</p>
                </div>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
