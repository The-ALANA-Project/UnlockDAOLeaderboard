import { Linkedin, Youtube, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-consensus-cream text-genesis-ink py-12 border-t border-[#020207]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
          {/* Social Media Icons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-protocol-peri/10 hover:bg-node-night rounded-[15px] transition-all duration-300 hover:scale-110 hover:shadow-md group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-genesis-ink group-hover:text-[#FFFDFA] transition-colors" />
            </a>
            <a
              href="https://www.tiktok.com/@unlock.dao"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-protocol-peri/10 hover:bg-node-night rounded-[15px] transition-all duration-300 hover:scale-110 hover:shadow-md group"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5 fill-genesis-ink group-hover:fill-[#FFFDFA] transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-protocol-peri/10 hover:bg-node-night rounded-[15px] transition-all duration-300 hover:scale-110 hover:shadow-md group"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 text-genesis-ink group-hover:text-[#FFFDFA] transition-colors" />
            </a>
            <a
              href="https://farcaster.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-protocol-peri/10 hover:bg-node-night rounded-[15px] transition-all duration-300 hover:scale-110 hover:shadow-md group"
              aria-label="Farcaster"
            >
              <svg className="w-5 h-5 fill-genesis-ink group-hover:fill-[#FFFDFA] transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.24 5.74h-1.44V15.5h-1.68V5.74H13.5v10.52a1.04 1.04 0 0 1-1.04 1.04h-0.92a1.04 1.04 0 0 1-1.04-1.04V5.74H9.12v9.76H7.44V5.74H5.76v12.72h12.48V5.74z"/>
              </svg>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-protocol-peri/10 hover:bg-node-night rounded-[15px] transition-all duration-300 hover:scale-110 hover:shadow-md group"
              aria-label="X (Twitter)"
            >
              <svg className="w-5 h-5 fill-genesis-ink group-hover:fill-[#FFFDFA] transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-protocol-peri/10 hover:bg-node-night rounded-[15px] transition-all duration-300 hover:scale-110 hover:shadow-md group"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-genesis-ink group-hover:text-[#FFFDFA] transition-colors" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-terminal-grey text-sm">
            © 2026 Ʉnlock Protocol DAO. All rights reserved.
          </p>
          
          {/* Built by */}
          <p className="text-terminal-grey text-sm">
            Built with 💜 by{' '}
            <a 
              href="https://www.linkedin.com/in/stella-achenbach/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-genesis-ink hover:text-protocol-peri underline font-semibold transition-colors"
            >
              Stella Achenbach
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}