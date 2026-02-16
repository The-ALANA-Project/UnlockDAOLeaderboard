import { useState } from 'react';

const steps = [
  {
    number: 1,
    description: 'Get yourself an Ethereum-enabled crypto wallet, it is your gateway to interacting with decentralized protocols such as Unlock.'
  },
  {
    number: 2,
    description: 'Whichever blockchain network you wish to use, you will need to pay the chain with gas fees. Depending on the network this can be Ether, Wrapped Ether or similar.'
  },
  {
    number: 3,
    description: 'Connect your now active and ready wallet with Ʉnlock Protocol by clicking "Get Started" and you are ready to go.'
  }
];

export function ProtocolOverview() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="protocol" className="py-24 bg-consensus-cream">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="mb-6 text-[40px] text-genesis-ink">How To Use Ʉnlock Protocol</h2>
          <p className="max-w-3xl text-xl text-terminal-grey">
            At its core Ʉnlock provides a set of smart contracts you can use for many different things like selling your products or safeguard your community. 
            But first you need to get preptared to "Get Started."
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative overflow-hidden p-8 rounded-t-[15px] bg-protocol-peri transition-all duration-300 hover:shadow-lg cursor-pointer h-fit"
            >
              <h3 className="mb-3 text-[#FFFDFA] text-[30px]">Step {step.number}</h3>
              
              {/* Expandable description */}
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  hoveredIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-[#FFFDFA]/90">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}