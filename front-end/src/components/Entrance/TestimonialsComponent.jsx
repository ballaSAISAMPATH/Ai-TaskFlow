import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsComponent = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechFlow Inc",
      content: "AI TaskFlow has revolutionized how our team manages projects. The AI-powered task suggestions are incredibly accurate and save us hours of planning time.",
      rating: 5,
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Developer",
      company: "InnovateLab",
      content: "The seamless integration between AI and manual task creation is brilliant. It's like having a smart assistant that understands our workflow perfectly.",
      rating: 5,
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Team Lead",
      company: "StartupHub",
      content: "Since implementing AI TaskFlow, our productivity has increased by 40%. The interface is intuitive and the AI suggestions are surprisingly insightful.",
      rating: 5,
      avatar: "ER"
    },
    {
      id: 4,
      name: "David Kim",
      role: "Project Coordinator",
      company: "AgileWorks",
      content: "Outstanding tool! The way it predicts task dependencies and suggests optimal workflows is game-changing for project management.",
      rating: 5,
      avatar: "DK"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Operations Manager",
      company: "GrowthCorp",
      content: "AI TaskFlow's smart categorization and priority suggestions have streamlined our entire operation. Highly recommended!",
      rating: 5,
      avatar: "LT"
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Freelance Consultant",
      company: "Wilson Consulting",
      content: "As a solo entrepreneur, AI TaskFlow helps me stay organized and focused. The AI insights feel like having a virtual project manager.",
      rating: 5,
      avatar: "JW"
    }
  ];

  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-16 bg-gradient-to-br from-white via-green-50/30 to-green-100/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their productivity with AI TaskFlow
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-green-50/30 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-green-50/30 to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-scroll space-x-6 w-max hover:pause-animation">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="w-80 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-100/50 group"
            >
              <div className="flex justify-between items-start mb-4">
                <Quote className="w-8 h-8 text-green-500/30 group-hover:text-green-500/50 transition-colors duration-300" />
                
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-green-500 text-green-500"
                    />
                  ))}
                </div>
              </div>

              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {testimonial.company}
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsComponent;