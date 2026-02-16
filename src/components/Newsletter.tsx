import { Mail } from 'lucide-react';
import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // Handle newsletter signup here
    setEmail('');
  };

  return (
    <section className="py-24 bg-consensus-cream">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <h2 className="mb-6 text-[40px] text-genesis-ink">Sign up for Updates</h2>
          <p className="mb-8 text-xl text-terminal-grey">
            Receive fresh news about Ʉnlock, including new features and opportunities to contribute and becoming part of a collectively owned technology.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-4">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-terminal-grey" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Type your email here"
                required
                className="w-full h-10 pl-12 pr-4 bg-white rounded-[15px] border-2 border-transparent focus:border-node-night focus:outline-none text-genesis-ink placeholder-terminal-grey transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-8 h-10 bg-node-night text-[#FFFDFA] rounded-[15px] hover:bg-protocol-peri transition-all whitespace-nowrap"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}