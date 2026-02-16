import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowUpRight, Search } from 'lucide-react';
import { useState } from 'react';

const useCases = [
  {
    title: 'Music Festivals',
    category: 'Event Ticketing',
    description: 'NFT-based tickets with built-in perks and collectible value for attendees.',
    image: 'https://images.unsplash.com/photo-1656283384093-1e227e621fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBjcm93ZHxlbnwxfHx8fDE3NjUxOTAwODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    stats: '50K+ tickets issued'
  },
  {
    title: 'Professional Certifications',
    category: 'Credentials',
    description: 'Verifiable blockchain-based certificates for courses, workshops, and professional development.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZXZlbnR8ZW58MXx8fHwxNzY1MTMzMjAxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    stats: '10K+ certificates'
  },
  {
    title: 'Art Galleries',
    category: 'Memberships',
    description: 'Exclusive access to exhibitions, previews, and collector communities.',
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5fGVufDF8fHx8MTc2NTE4Mjg4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    stats: '2K+ members'
  },
  {
    title: 'Fitness Studios',
    category: 'Memberships',
    description: 'Token-gated class access and community rewards for gym members.',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY2xhc3N8ZW58MXx8fHwxNzY1MjIzMDk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    stats: '5K+ active passes'
  },
  {
    title: 'Tech Conferences',
    category: 'Event Ticketing',
    description: 'Multi-day event passes with networking features and proof of attendance.',
    image: 'https://images.unsplash.com/photo-1529209076408-5a115ec9f1c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwY29tbXVuaXR5fGVufDF8fHx8MTc2NTIyMzA5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    stats: '15K+ attendees'
  },
  {
    title: 'DAO Communities',
    category: 'Memberships',
    description: 'Governance tokens and membership NFTs for decentralized organizations.',
    image: 'https://images.unsplash.com/photo-1666816943035-15c29931e975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjUxNjgxNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    stats: '8K+ token holders'
  }
];

export function UseCases() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUseCases = useCases.filter((useCase) =>
    useCase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    useCase.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    useCase.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="use-cases" className="py-24 bg-protocol-peri">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="mb-6 text-[40px] text-[#FFFDFA]">Community Projects & dApps</h2>
          <p className="max-w-3xl text-xl text-[#FFFDFA]/90 mb-8">
            From global community festivals to professional certifications, Ʉnlock Protocol enables creators, developers, and organizations to build meaningful connections with their communities.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-terminal-grey" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-consensus-cream rounded-[15px] border border-white/30 focus:border-white focus:outline-none text-genesis-ink placeholder:text-terminal-grey/60"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUseCases.map((useCase, index) => (
            <div
              key={index}
              className="group bg-consensus-cream rounded-t-[15px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden rounded-t-[15px] bg-consensus-cream">
                <ImageWithFallback
                  src={useCase.image}
                  alt={useCase.title}
                  className="w-full h-full object-cover rounded-t-[15px] transition-transform duration-500 group-hover:scale-110"
                  style={{ transformOrigin: 'center center' }}
                />
                <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                  <span className="text-sm text-node-night">{useCase.category}</span>
                </div>
              </div>
              
              <div className="p-6 bg-consensus-cream">
                <h4 className="mb-3 text-genesis-ink">{useCase.title}</h4>
                <p className="text-terminal-grey mb-4">{useCase.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-node-night">{useCase.stats}</span>
                  <ArrowUpRight className="w-5 h-5 text-node-night group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-12 text-[#FFFDFA]/90 leading-relaxed text-[16px]">
          <strong>Disclaimer:</strong> These are community projects. We are not promoting or endorsing them in any way and take no legal responsibility as a Decentralized Autonomous Community. Please do your own research before connecting or using them.
        </p>
      </div>
    </section>
  );
}