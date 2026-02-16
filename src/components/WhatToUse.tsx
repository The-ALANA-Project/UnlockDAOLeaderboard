import { Ticket, Award, Users, Lock, Newspaper, Zap } from 'lucide-react';
import { useState } from 'react';

const useCases = [
  {
    icon: Users,
    title: 'Memberships',
    description: 'Create exclusive communities',
    details: 'Build token-gated access for clubs, DAOs, and premium communities. Control who gets in and offer tiered membership levels.',
    color: 'bg-node-night'
  },
  {
    icon: Ticket,
    title: 'Event Ticketing',
    description: 'Secure, verifiable tickets',
    details: 'Issue NFT-based tickets that prevent fraud, enable resale controls, and provide proof of attendance for your events.',
    color: 'bg-protocol-peri'
  },
  {
    icon: Award,
    title: 'Certifications',
    description: 'Verifiable credentials',
    details: 'Issue tamper-proof certificates and credentials that recipients truly own and can prove authentically anywhere.',
    color: 'bg-node-night'
  },
  {
    icon: Lock,
    title: 'Content Gating',
    description: 'Monetize your content',
    details: 'Lock premium content, courses, or resources behind NFT access. Perfect for creators, educators, and publishers.',
    color: 'bg-protocol-peri'
  },
  {
    icon: Newspaper,
    title: 'Subscriptions',
    description: 'Recurring access models',
    details: 'Offer time-based subscriptions with automatic renewals. Give subscribers true ownership of their membership.',
    color: 'bg-node-night'
  },
  {
    icon: Zap,
    title: 'Custom Solutions',
    description: 'Build anything you imagine',
    details: 'Use our flexible protocol to create custom access control systems for any use case you can dream up.',
    color: 'bg-protocol-peri'
  }
];

export function WhatToUse() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-protocol-peri">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="mb-6 text-[40px] text-[#FFFDFA]">Why Ʉnlock Protocol?</h2>
          <p className="max-w-3xl text-xl text-[#FFFDFA]/90">
            Ʉnlock Protocol is your code-free solution for letting even non-coders deploy smart contracts on 14 different blockchain networks. 
            These contracts can be used for many different usages but here are some concrete examples to get you started:
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative overflow-hidden rounded-t-[15px] bg-white border-2 border-transparent hover:border-protocol-peri transition-all duration-300"
            >
              {/* Animated background gradient */}
              <div 
                className={`absolute inset-0 ${useCase.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />
              
              <div className="relative p-8">
                {/* Content */}
                <h3 className="text-genesis-ink mb-3 text-[30px]">{useCase.title}</h3>
                <p className="text-terminal-grey mb-4">{useCase.description}</p>
                
                {/* Expandable details */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    hoveredIndex === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pt-4 border-t border-protocol-peri/20">
                    <p className="text-terminal-grey text-sm leading-relaxed">
                      {useCase.details}
                    </p>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className={`mt-4 text-node-night transition-all duration-300`}>
                  <span className="text-sm">Learn more</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}