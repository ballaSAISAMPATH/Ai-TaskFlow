import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Quote, Loader2, AlertCircle } from 'lucide-react';

import { fetchAllTestimonials } from '@/store/testimonials.js';

const TestimonialsComponent = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const dispatch = useDispatch();
  
  const { testimonials, loading, error, pagination } = useSelector(state => state.testimonials);

  // Use unique key instead of just testimonial._id
  const toggleExpanded = (uniqueKey) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(uniqueKey)) {
      newExpanded.delete(uniqueKey);
    } else {
      newExpanded.add(uniqueKey);
    }
    setExpandedCards(newExpanded);
  };

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const getAvatarInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTestimonials = (testimonialList) => {
    return testimonialList.map(testimonial => ({
      ...testimonial,
      avatar: getAvatarInitials(testimonial.name)
    }));
  };

  const formattedTestimonials = formatTestimonials(testimonials || []);
  const duplicatedTestimonials = [
    ...formattedTestimonials.map((t, i) => ({ ...t, uniqueId: `first-${i}` })),
    ...formattedTestimonials.map((t, i) => ({ ...t, uniqueId: `second-${i}` }))
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    dispatch(fetchAllTestimonials({ page: 1, limit: 20 }));
  }, [dispatch]);

  const SkeletonCard = () => (
    <div className="w-80 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
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

          {isMobile ? (
            <div className="overflow-x-auto px-4">
              <div className="flex space-x-6 w-max pb-4">
                {[...Array(3)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex space-x-6 w-max">
              {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-white via-green-50/30 to-green-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <span>{error}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!formattedTestimonials.length) {
    return (
      <section className="py-16 bg-gradient-to-br from-white via-green-50/30 to-green-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600">No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const renderTestimonialCard = (testimonial, index) => {
    // Create unique key for each card instance
    const uniqueKey = testimonial.uniqueId || `${testimonial._id || 'testimonial'}-${index}`;
    const isExpanded = expandedCards.has(uniqueKey);
    const shouldTruncate = testimonial.content.length > 120;
    
    return (
      <div
        key={uniqueKey}
        className="w-80 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-100/50 group flex flex-col relative"
        style={{ minHeight: '280px' }} 
      >
        <div className="flex justify-between items-start mb-4">
          <Quote className="w-8 h-8 text-green-500/30 group-hover:text-green-500/50 transition-colors duration-300" />
          
          <div className="flex space-x-1">
            {[...Array(testimonial.rating || 5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-green-500 text-green-500"
              />
            ))}
          </div>
        </div>

        <div className="mb-6 flex-grow">
          <blockquote className="text-gray-700 leading-relaxed">
            "{isExpanded ? testimonial.content : truncateText(testimonial.content)}"
          </blockquote>
          
          {shouldTruncate && (
            <button
              onClick={() => toggleExpanded(uniqueKey)}
              className="text-green-600 hover:text-green-700 text-sm font-medium mt-2 transition-colors duration-200"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

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
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    );
  };

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

        {isMobile ? (
          <div className="overflow-x-auto px-4">
            <div className="flex space-x-6 w-max pb-4">
              {formattedTestimonials.map((testimonial, index) => 
                renderTestimonialCard(testimonial, index)
              )}
            </div>
          </div>
        ) : (
          <div className={`flex space-x-6 w-max ${!isMobile ? 'animate-scroll hover:pause-animation' : ''}`}>
            {duplicatedTestimonials.map((testimonial, index) => 
              renderTestimonialCard(testimonial, index)
            )}
          </div>
        )}
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
          animation: scroll 10s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsComponent;