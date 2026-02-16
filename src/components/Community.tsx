import { MessageCircle, Github, Twitter, FileText, ArrowRight, Users } from 'lucide-react';
import { useState } from 'react';
import pizzaDaoImg from 'figma:asset/b9859440482396997b3be5ea9f6ab18e8590a575.png';
import edgeNodeImg from 'figma:asset/86d92bab59d72b9c674bdb1d8caa3fd2181022c3.png';
import farconImg from 'figma:asset/65e8004a17249c35cbacb7c28b06fb248c62ab48.png';
import dappConImg from 'figma:asset/065d95cab2c9f9eefdf80101b395c1a578ecd495.png';
import hatsProtocolImg from 'figma:asset/83f757b8648c5d5c042c2afd855cceafaa22dda5.png';
import thirdwebImg from 'figma:asset/e4b1f63245c18c6f93ed6fb64df4767e54ad7868.png';

const communityLinks = [
  {
    icon: MessageCircle,
    title: 'Discord Community',
    description: 'Join 10,000+ members building with Ʉnlock',
    action: 'Join Discord',
    color: 'bg-node-night'
  },
  {
    icon: Github,
    title: 'Open Source',
    description: 'Contribute to the protocol and build integrations',
    action: 'View GitHub',
    color: 'bg-genesis-ink'
  },
  {
    icon: Twitter,
    title: 'Stay Updated',
    description: 'Follow us for the latest news and updates',
    action: 'Follow on Twitter',
    color: 'bg-node-night'
  },
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Comprehensive guides and API references',
    action: 'Read Docs',
    color: 'bg-genesis-ink'
  }
];

const stats = [
  { 
    value: '31,709', 
    label: 'Membership Smart Contracts (Locks) Deployed',
    subtitle: 'All time, production networks only'
  },
  { 
    value: '643,740', 
    label: 'Membership NFTs (Keys) Minted',
    subtitle: 'All time, production networks only'
  },
  { 
    value: '282%', 
    label: 'Growth in Number of Deployed Smart Contracts',
    subtitle: 'Year-over-year, production networks only'
  }
];

const famousProjects = [
  {
    name: 'PizzaDAO',
    image: pizzaDaoImg,
    link: 'https://pizzadao.xyz'
  },
  {
    name: 'Hats Protocol',
    image: hatsProtocolImg,
    link: 'https://hatsprotocol.xyz'
  },
  {
    name: 'Farcon',
    image: farconImg,
    link: 'https://farcon.xyz'
  },
  {
    name: 'Thirdweb',
    image: thirdwebImg,
    link: 'https://thirdweb.com'
  },
  {
    name: 'DappCon',
    image: dappConImg,
    link: 'https://dappcon.io'
  },
  {
    name: 'Edge & Node',
    image: edgeNodeImg,
    link: 'https://edgeandnode.com'
  }
];

export function Community() {
  // Duplicate the array for seamless infinite scroll
  const duplicatedProjects = [...famousProjects, ...famousProjects];

  return (
    <section id="community" className="pt-24 pb-12 bg-consensus-cream">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="mb-6 text-[40px] text-genesis-ink">Ʉnlock Is Famous</h2>
          <p className="max-w-3xl text-xl text-terminal-grey">
            Ʉnlock has been around for a while and has been used over the years by many projects and individuals alike. The protocol is fully audited and safe, used before you by:
          </p>
        </div>

        {/* Famous Projects Carousel */}
        <div className="mb-16 overflow-hidden py-8">
          <div className="flex animate-infinite-scroll hover:pause-animation">
            {duplicatedProjects.map((project, index) => (
              <div key={index} className="flex-shrink-0 px-8">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-32 h-32 object-contain rounded-[15px] transition-all duration-300 hover:scale-110"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-protocol-peri rounded-[15px] p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
                <h3 className="text-[30px] mb-3 text-[rgb(255,253,250)]">{stat.value}</h3>
                <div className="text-[rgb(83,83,83)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}