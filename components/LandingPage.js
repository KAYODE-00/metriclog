'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink leading-tight">
            Every word,
            <br />
            <span className="text-accent">measured.</span>
          </h1>
          <p className="text-xl text-inksoft max-w-2xl mx-auto">
            A thoughtful blog platform that celebrates depth over speed. Write, share, and connect through meaningful stories.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-accent text-paper px-8 py-3 rounded-sm font-semibold hover:bg-ink transition"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 border border-hairline text-ink px-8 py-3 rounded-sm font-semibold hover:border-accent transition"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-12">
        <FeatureCard
          title="Write with Purpose"
          description="Craft articles that matter. No character limits, no noise—just authentic storytelling."
          icon="✍️"
        />
        <FeatureCard
          title="Measure Your Impact"
          description="Track word counts, reading time, and engagement metrics to understand your audience."
          icon="📊"
        />
        <FeatureCard
          title="Build Community"
          description="Comment, like, and engage with writers. Create lasting connections through meaningful discourse."
          icon="🤝"
        />
      </section>

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
          <ArrowRight size={18} />
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
