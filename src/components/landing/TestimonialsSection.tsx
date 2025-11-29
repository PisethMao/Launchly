/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useState } from "react";

export default function TestimonialsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-32 font-poppins overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide uppercase">
              Testimonials
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Loved by Developers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Launchly helps teams ship faster with confidence and zero configuration pain.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index: any) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />

              {/* Card */}
              <div className="relative h-full p-7 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-500/10 dark:via-transparent dark:to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Quote icon with animation */}
                  <div className="mb-5 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    <svg
                      className="w-10 h-10 text-blue-500 dark:text-blue-400 opacity-60"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Quote text */}
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-8 min-h-[140px] text-[15px] transition-colors duration-300">
                    {testimonial.quote}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                  {/* Author info */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {/* Avatar glow */}
                      <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur-md transition-all duration-500" />

                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="relative w-14 h-14 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-4 group-hover:ring-blue-400/50 dark:group-hover:ring-blue-500/50 transition-all duration-500 transform group-hover:scale-105"
                      />

                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900 transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 truncate">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 truncate">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-blue-500/10 to-transparent dark:from-blue-400/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-20 flex justify-center gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-400 transition-all duration-300 cursor-pointer"
              style={{
                transform: hoveredIndex === i ? 'scale(1.5)' : 'scale(1)',
                backgroundColor: hoveredIndex === i ? 'rgb(59, 130, 246)' : undefined
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote: '"Launchly reduced our deployment setup time from hours to minutes. No DevOps, no server headaches - just push and go live."',
    name: "Powin Lin",
    role: "System Administrator (SysAdmin)",
    image: "/powin.jpg"
  },
  {
    quote: '"Our tem ships updates daily now. The real-time build logs and isolated environments solved issues we used to chase for days."',
    name: "Monika Phan",
    role: "Full Stack Developer",
    image: "/monika.jpg"
  },
  {
    quote: '"We used Launchly for hackathon projects and student portfolios - setup takes less than a minute. This is how development should feel."',
    name: "Chanchhay Srey",
    role: "Full Stack Developer",
    image: "/chanchhay.jpg"
  },
  {
    quote: '"We switched from manual VPS setup to Launchly. No more messing with Nginx or SSL renewals. Our deployments are finally stress-free."',
    name: "Kompheak Yan",
    role: "Frontend Developer",
    image: "/kompheak.jpg"
  },
  {
    quote: '"Launchly is perfect for classes and workshops. Student deploys their projects instantly instead of wasting time configuring servers."',
    name: "Nona Yorn",
    role: "Frontend Team Lead",
    image: "/nona.jpg"
  },
  {
    quote: '"No config files. No pipeline setup. Launchly just works. We deploy previews for every branch without touching DevOps."',
    name: "Sovanthong Soung",
    role: "System Administrator (SysAdmain)",
    image: "/sovanthong.jpg"
  },
  {
    quote: '"We integrated Launchly into our graduation project showcase. Everyone\'s app was deployed live in seconds. It made the event run smoothly."',
    name: "Manet Roeun",
    role: "Student / Indie Builder",
    image: "/manet.png"
  },
  {
    quote: '"Setting up deployments used to be the most annoying part. Launchly made it the easyest. It feels like magic every time we push."',
    name: "Piseth Mao",
    role: "Software Engineer",
    image: "/piseth.jpg"
  }
];
