import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function VideoHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1758263995648-222571672475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwZXZlbnQlMjB0aWNrZXRzfGVufDF8fHx8MTc2NTIyNjI2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Concert and event ticketing'
    },
    {
      url: 'https://images.unsplash.com/photo-1658235081452-c2ded30b8d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VydGlmaWNhdGUlMjBlZHVjYXRpb258ZW58MXx8fHwxNzY1MjI2MjYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Educational certifications'
    },
    {
      url: 'https://images.unsplash.com/photo-1762608206423-be8c07645de7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBtZW1iZXJzJTIwbWVldGluZ3xlbnwxfHx8fDE3NjUyMjYyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Community memberships'
    },
    {
      url: 'https://images.unsplash.com/photo-1673767297353-0a4c8ad61b05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdG9yJTIwc3R1ZGlvJTIwY29udGVudHxlbnwxfHx8fDE3NjUyMjYyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Creator content access'
    },
    {
      url: 'https://images.unsplash.com/photo-1567606722551-616ddc8bb9a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJzY3JpcHRpb24lMjBtZW1iZXJzaGlwJTIwY2FyZHxlbnwxfHx8fDE3NjUyMjYyNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      alt: 'Product subscriptions'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-protocol-peri" style={{ minHeight: '85vh' }}>
      {/* Slideshow Background */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.url}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-30' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Open Canvas Overlay for better text readability */}
      <div className="absolute inset-0 bg-open-canvas/40" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 mt-16">
        <h1 className="mb-6 text-genesis-ink text-left" style={{ fontSize: '50px' }}>
          Create Memberships,<br />
          Certifications & Events<br />
          <span className="text-node-night">Without Code</span>
        </h1>
        
        <p className="max-w-2xl mb-12 text-xl text-terminal-grey text-left">
          Ʉnlock Protocol is an easy-to-use technology that enables the creation of memberships, certifications, and event ticketing powered by blockchain technology.
        </p>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          <a
            href="https://unlock-protocol.com/guides/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 h-10 bg-node-night text-[#FFFDFA] rounded-[15px] hover:bg-open-canvas hover:text-node-night hover:border hover:border-node-night transition-all duration-300 flex items-center gap-2 border border-transparent"
          >
            Our Guides
          </a>
          <a
            href="https://docs.unlock-protocol.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 h-10 bg-[#FFFDFA] text-node-night rounded-[15px] hover:bg-node-night hover:text-[#FFFDFA] transition-all duration-300 hover:scale-105 hover:shadow-lg border border-node-night flex items-center justify-center"
          >
            View Documentation
          </a>
        </div>
      </div>

      {/* Slideshow Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-node-night w-8'
                : 'bg-genesis-ink/30 hover:bg-genesis-ink/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}