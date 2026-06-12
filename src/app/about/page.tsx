import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import PageTransition from "@/components/PageTransition";
import AmbientGlow from "@/components/AmbientGlow";
import ProjectsMarquee from "@/components/ProjectsMarquee";
import {
  Heart, Users,
  ArrowRight, ExternalLink, Quote, Star,
  Target, Repeat2, Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Miss Wanjey — Founder & CEO, Wanjey Events & Marketing",
  description:
    "Meet Wanjiku C. Wanjiru — Miss Wanjey — Digital Marketing Consultant, Event Planner, Brand Strategist, and Founder & CEO of Wanjey Events & Marketing.",
  openGraph: {
    title: "About Miss Wanjey",
    description:
      "The story, philosophy, and journey behind Wanjey Events & Marketing.",
    url: "https://misswanjey.co.ke/about",
  },
};

const timeline = [
  { year: "2016", title: "Education & Community Building", desc: "Began working with children and families, learning trust, communication, and the power of community." },
  { year: "2017", title: "Marketing & Ticket Sales", desc: "Joined KU Drama Club — discovered the intersection of relationships, audience mobilization, and revenue." },
  { year: "2019", title: "Hospitality Marketing", desc: "Entered the hospitality industry as a Digital Marketing & Social Media Manager, building brand visibility for hospitality clients." },
  { year: "2021", title: "Founded Wanjey Events & Marketing", desc: "Officially launched the company — combining years of community, marketing, and event expertise into one creative powerhouse." },
  { year: "2023+", title: "Festivals, Talent Management & Consultancy", desc: "Scaled into festivals, influencer programs, talent management, and strategic brand consultancy across Kenya." },
];

const philosophy = [
  { icon: Users, label: "Communities become clients.", sub: "Every relationship is an asset — built through trust and genuine engagement." },
  { icon: Repeat2, label: "Relationships become opportunities.", sub: "The strongest business pipelines are built person to person, not ad to conversion." },
  { icon: Target, label: "Consistency compounds.", sub: "Long-term results are born from disciplined, daily execution — not one-off moments." },
];



export default function AboutPage() {
  return (
    <PageTransition>

      {/* ── CINEMATIC HERO ── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        {/* Background image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero-bg.jpg"
            alt="Miss Wanjey"
            fill
            className="object-cover object-center"
            quality={95}
            priority
          />
          <div className="absolute inset-0 bg-black/10 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Gold shimmer strip */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent))] to-transparent opacity-60" />
        </div>

        <div className="container relative z-10 pb-20 pt-40">
          <AnimatedSection>
            <p className="section-label text-accent mb-4">The Founder</p>
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-[1.0] uppercase drop-shadow-2xl max-w-4xl">
              Miss<br />Wanjey
            </h1>
            <p className="mt-6 text-white/70 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
              Digital Marketing Consultant · Event Planner · Brand Strategist · Founder & CEO
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FOUNDER INTRO ── */}
      <section className="relative py-14 md:py-20 overflow-hidden">
        <AmbientGlow />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Portrait */}
            <AnimatedSection className="relative">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                {/* Gold border frame */}
                <div className="absolute -inset-3 rounded-3xl border border-accent/30 -z-10" />
                <div className="absolute -inset-6 rounded-3xl border border-accent/10 -z-10" />
                <Image
                  src="/assets/p2.jpeg"
                  alt="Wanjiku C. Wanjiru — Miss Wanjey"
                  width={560}
                  height={680}
                  className="w-full rounded-2xl object-cover shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]"
                  quality={92}
                />
                {/* Floating badge */}
                <div className="absolute -bottom-5 -right-5 glass-card px-5 py-4 rounded-2xl shadow-2xl border border-accent/30">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent">Founded</p>
                  <p className="text-3xl font-serif font-black text-foreground leading-tight">2021</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Bio text */}
            <AnimatedSection delay={0.15}>
              <p className="section-label mb-3">About Miss Wanjey</p>
              <h2 className="section-heading">Building Brands, Communities &amp; Unforgettable Experiences</h2>

              <div className="mt-8 space-y-5 text-[15px] md:text-base leading-[1.85] text-muted-foreground">
                <p>
                  I am <strong className="text-foreground font-semibold">Wanjiku C. Wanjiru</strong>, popularly known as Miss Wanjey — a Digital Marketing Consultant, Event Planner, Brand Strategist, and the Founder &amp; CEO of Wanjey Events &amp; Marketing.
                </p>
                <p>
                  My journey has never been about jumping from one industry to another. Instead, it has been a continuous evolution within one ecosystem: <strong className="text-foreground">people, communities, marketing, experiences, events, and brands.</strong>
                </p>
                <p>
                  What started as working with children and engaging parents through educational and recreational programs gradually evolved into event planning, hospitality marketing, influencer management, brand partnerships, and entrepreneurship. Through every stage of my career, one principle remained constant: <strong className="text-foreground">consistency.</strong>
                </p>
                <p>
                  Today, I help brands connect with audiences, create memorable experiences, and build meaningful relationships that drive growth.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/contact">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-7 h-12 text-[14px] transition-all duration-300">
                    Work With Me <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/packages">
                  <Button variant="outline" className="font-bold px-7 h-12 text-[14px] border-foreground/20 hover:border-accent/50 transition-all duration-300">
                    View Packages
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="gradient-separator" />

      {/* ── ORIGIN STORY ── */}
      <section className="py-12 md:py-16">
        <div className="container">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
            <p className="section-label mb-3">The Journey</p>
            <h2 className="section-heading">From Education to Entrepreneurship</h2>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                heading: "The Foundation",
                body: "My professional journey began while studying at Kenyatta University, where I pursued a Bachelor's Degree in Education (English & Literature). While my academic background was in education, my passion for communication, community engagement, and relationship building led me toward marketing and events.",
              },
              {
                heading: "Early Career",
                body: "Early in my career, I worked with children and families, where I learned invaluable lessons about trust, communication, customer behavior, and service delivery. These experiences laid the foundation for understanding how strong communities become powerful business opportunities.",
              },
              {
                heading: "The Spark",
                body: "During my university years, I joined the Kenyatta University Drama Club and became actively involved in ticket sales, event promotions, and audience mobilization. This experience introduced me to the world of marketing and demonstrated how relationships can drive remarkable business results.",
              },
              {
                heading: "Hospitality & Digital Marketing",
                body: "In 2019, I entered the hospitality industry as a Digital Marketing and Social Media Manager, helping hospitality brands build their online presence, execute influencer campaigns, and strengthen their market positioning — expanding my expertise in digital marketing, content strategy, and customer engagement.",
              },
            ].map((block, i) => (
              <AnimatedSection key={block.heading} delay={i * 0.07}>
                <div className="glass-card p-8 md:p-10">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">{block.heading}</h3>
                  <p className="text-muted-foreground leading-[1.85] text-[15px] md:text-base">{block.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      {/* ── FIXED BACKGROUND BREAKOUT ── */}
      <section className="relative py-20 md:py-28 overflow-hidden w-full" style={{ clipPath: "inset(0)" }}>
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: 'url("/assets/gallery/event-31.jpg")',
            height: "100vh",
            width: "100vw"
          }}
        />
        <div className="absolute inset-0 bg-black/45 z-0" />
        <div className="container relative z-10 text-center py-10">
          <h3 className="font-serif text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight uppercase drop-shadow-lg max-w-3xl mx-auto">
            Creating Memorable Brand Experiences
          </h3>
        </div>
      </section>
      {/* ── CAREER TIMELINE ── */}
      <section className="py-12 md:py-20">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <p className="section-label mb-3">Career Timeline</p>
            <h2 className="section-heading">A Decade of Growth</h2>
          </AnimatedSection>

          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent/60 via-accent/30 to-transparent md:left-1/2 md:-translate-x-px hidden sm:block" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <AnimatedSection key={item.year} delay={i * 0.08}>
                  <div className={`relative flex gap-6 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                    {/* Year bubble — center */}
                    <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-xs shadow-[0_0_0_4px_hsl(var(--background)),0_0_0_6px_hsl(var(--accent)/0.3)]">
                      {item.year.replace("+", "")}
                    </div>

                    {/* Card */}
                    <div className={`glass-card p-6 w-full sm:w-[calc(50%-2.5rem)] ${i % 2 === 0 ? "sm:mr-auto sm:pr-10" : "sm:ml-auto sm:pl-10"}`}>
                      {/* Mobile year */}
                      <div className="flex items-center gap-3 sm:hidden mb-3">
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-[10px] shrink-0">
                          {item.year.slice(2)}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">{item.year}</span>
                      </div>
                      <p className="hidden sm:block text-xs font-bold uppercase tracking-widest text-accent mb-2">{item.year}</p>
                      <h3 className="font-serif text-lg font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-[1.75]">{item.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-separator" />

      {/* ── FOUNDING STORY ── */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{ clipPath: "inset(0)" }}>
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: 'url("/assets/gallery/event-30.jpg")', height: "100vh", width: "100vw" }}
        />
        <div className="absolute inset-0 bg-black/70 z-0" />
        <div className="container relative z-10 text-center">
          <AnimatedSection>
            <p className="section-label text-accent mb-4">The Beginning</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight max-w-3xl mx-auto">
              Founding Wanjey Events &amp; Marketing
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="mt-8 text-white/75 leading-[1.85] max-w-2xl mx-auto text-[15px] md:text-base">
              In 2021, I officially founded Wanjey Events &amp; Marketing — built from years of experience in community building, marketing, hospitality, and event coordination. What began with luxury picnics quickly expanded into corporate events, weddings, festivals, influencer campaigns, talent management, brand activations, and strategic marketing consultancy.
            </p>
            <p className="mt-5 text-white/75 leading-[1.85] max-w-2xl mx-auto text-[15px] md:text-base">
              Today, Wanjey Events &amp; Marketing serves as a creative partner for businesses, organizations, public figures, and brands looking to create memorable experiences and meaningful audience connections.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="gradient-separator" />

      {/* ── NOTABLE PROJECTS ── */}
      <section className="py-20 md:py-28">
        <div className="container">
          <AnimatedSection className="text-center mb-14">
            <p className="section-label mb-3">Track Record</p>
            <h2 className="section-heading">Notable Projects &amp; Collaborations</h2>
            <p className="section-subtext">
              A curated selection of major projects, festivals, and campaigns that have shaped the Wanjey brand.
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <ProjectsMarquee />
          </AnimatedSection>

          <AnimatedSection delay={0.3} className="mt-10 text-center">
            <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
              I have also worked alongside leading brands, public figures, artists, influencers, and corporate organizations — helping them strengthen audience engagement, visibility, and brand impact.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="gradient-separator" />

      {/* ── PHILOSOPHY ── */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <AmbientGlow />
        <div className="container relative z-10">
          <AnimatedSection className="text-center mb-14">
            <p className="section-label mb-3">Philosophy</p>
            <h2 className="section-heading">The Principles That Guide Everything</h2>
          </AnimatedSection>

          {/* Pull quote */}
          <AnimatedSection delay={0.05} className="max-w-3xl mx-auto mb-14">
            <div className="glass-card p-10 md:p-14 text-center relative">
              <Quote className="h-10 w-10 text-accent/30 mx-auto mb-6" />
              <blockquote className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-[1.4] text-balance">
                &ldquo;Communities become clients. Relationships become opportunities. Consistency compounds.&rdquo;
              </blockquote>
              <p className="mt-6 text-sm font-bold uppercase tracking-widest text-accent">— Miss Wanjey</p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {philosophy.map((p, i) => (
              <AnimatedSection key={p.label} delay={0.1 + i * 0.08}>
                <div className="glass-card p-8 h-full flex flex-col">
                  <div className="h-12 w-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center mb-5 shadow-lg shadow-accent/10">
                    <p.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-3">{p.label}</h3>
                  <p className="text-muted-foreground text-sm leading-[1.75] flex-1">{p.sub}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-separator" />

      {/* ── BRAND FAMILY ── */}
      <section className="py-12 md:py-16">
        <div className="container">
          <AnimatedSection className="text-center mb-14">
            <p className="section-label mb-3">The Brand Family</p>
            <h2 className="section-heading">Miss Wanjey Brand Ecosystem</h2>
            <p className="section-subtext">
              Miss Wanjey is a personal brand that champions excellence across multiple ventures.
            </p>
          </AnimatedSection>

          <div className="mt-4 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <AnimatedSection delay={0.08}>
              <div className="glass-card group p-8 h-full flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 mb-5 shadow-lg shadow-accent/10">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Miss Wanjey Digital Consultant</h3>
                <p className="text-sm leading-[1.75] text-muted-foreground flex-1">
                  Premium corporate events management, brand activations, and strategic digital marketing for businesses that want to stand out.
                </p>
                <a
                  href="https://www.instagram.com/miss_wanjey_digital_consultant?igsh=MTA0Zmp3bmJqOXpkYw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline transition-colors"
                >
                  Follow on Instagram <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.16}>
              <div className="glass-card group p-8 h-full flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 mb-5 shadow-lg shadow-accent/10">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Toto Kingdom</h3>
                <p className="text-sm leading-[1.75] text-muted-foreground flex-1">
                  A vibrant children&apos;s entertainment and events brand creating unforgettable experiences for kids — from themed parties to interactive play events.
                </p>
                <a
                  href="https://www.instagram.com/toto_kingdom_systems_events?igsh=eXB6aTdsM3ZlYXZp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline transition-colors"
                >
                  Follow on Instagram <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="gradient-separator" />

      {/* ── CTA ── */}
      <section className="py-12 md:py-20 text-center">
        <div className="container">
          <AnimatedSection>
            <p className="section-label mb-4">Looking Ahead</p>
            <h2 className="section-heading max-w-2xl mx-auto">
              Ready to Create Something Impactful Together?
            </h2>
            <p className="section-subtext mt-6 max-w-lg">
              Whether through event planning, digital marketing, talent management, or brand consulting — Miss Wanjey is committed to delivering excellence, creativity, and measurable results.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.15} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-10 h-14 text-[15px] transition-all duration-300">
                Start a Conversation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/packages">
              <Button size="lg" variant="outline" className="font-bold px-10 h-14 text-[15px] border-foreground/20 hover:border-accent/50 transition-all duration-300">
                Explore Packages
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

    </PageTransition>
  );
}
