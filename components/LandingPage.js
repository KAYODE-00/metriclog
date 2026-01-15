"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PenSquare,
  BarChart3,
  Users,
  BookOpen,
  Sparkles,
} from "lucide-react";
function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}


export default function LandingPage() {
const features = [
  {
    icon: PenSquare,
    title: "Write with Purpose",
    description:
      "Craft long-form articles with a distraction-free writing experience.",
  },
  {
    icon: BarChart3,
    title: "Measure Your Impact",
    description:
      "Understand readers with analytics, reading time and engagement.",
  },
  {
    icon: Users,
    title: "Build Community",
    description:
      "Create conversations around ideas, not algorithms.",
  },
];

    const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};
  return (
    <div className="min-h-screen bg-paper">
      {/* Hero Section */}
<motion.section
  variants={stagger}
  initial="hidden"
  animate="show"
  className="relative overflow-hidden"
>
  <div className="absolute inset-0 -z-10">
    <motion.div
      animate={{
        scale: [1, 1.15, 1],
        rotate: [0, 10, 0],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
      }}
      className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
    />
  </div>



  <motion.h1
    variants={fadeUp}
    className="mt-8 font-display text-6xl font-bold leading-[1.05] text-ink md:text-7xl"
  >
    Every word,
    <br />
    <span className="text-accent">carefully measured.</span>
  </motion.h1>

  <motion.p
    variants={fadeUp}
    className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-inksoft"
  >
    Write beautiful long-form content, build an audience, and publish stories
    that matter.
  </motion.p>

  <motion.div
    variants={fadeUp}
    className="mt-12 flex justify-center gap-5"
  >
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: .98 }}>
      <Link
        href="/signup"
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3 font-semibold text-paper shadow-lg"
      >
        Get Started
        <ArrowRight size={18} />
      </Link>
    </motion.div>

    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: .98 }}>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-white/60 px-7 py-3 backdrop-blur"
      >
        Log In
      </Link>
    </motion.div>
  </motion.div>
</motion.section>

      {/* Features Section */}
<motion.section
  variants={stagger}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  className="mx-auto mt-32 grid max-w-6xl gap-8 md:grid-cols-3"
>
  {features.map((feature) => {
    const Icon = feature.icon;

    return (
      <motion.div
        key={feature.title}
        variants={fadeUp}
        whileHover={{
          y: -10,
          scale: 1.02,
        }}
        className="rounded-3xl border border-hairline bg-white/60 p-8 backdrop-blur-xl"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
          <Icon className="text-accent" size={28} />
        </div>

        <h3 className="font-display text-xl font-semibold text-ink">
          {feature.title}
        </h3>

        <p className="mt-3 leading-7 text-inksoft">
          {feature.description}
        </p>
      </motion.div>
    );
  })}
</motion.section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 bg-accentsoft rounded-sm text-center space-y-6">
        <h2 className="font-display text-3xl font-bold text-ink">
          Ready to start writing?
        </h2>
        <p className="text-inksoft max-w-xl mx-auto">
          Join writers who believe in the power of measured, thoughtful content.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-2 bg-accent text-paper px-8 py-3 rounded-sm font-semibold hover:bg-ink transition"
        >
          Create Your Account
          <ArrowIcon />
        </Link>
      </section>

      {/* Footer Info */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-hairline">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink mb-3">
              For Writers
            </h3>
            <ul className="space-y-2 text-sm text-inksoft">
              <li>✓ Beautiful editor with real-time preview</li>
              <li>✓ Automatic reading time calculation</li>
              <li>✓ Rich text formatting & markdown support</li>
              <li>✓ Draft management and publishing control</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink mb-3">
              For Readers
            </h3>
            <ul className="space-y-2 text-sm text-inksoft">
              <li>✓ Curated collection of thoughtful articles</li>
              <li>✓ Search and tag-based discovery</li>
              <li>✓ Engage through comments & likes</li>
              <li>✓ Follow writers you love</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="text-center space-y-3">
      <div className="text-4xl">{icon}</div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="text-inksoft">{description}</p>
    </div>
  );
}
