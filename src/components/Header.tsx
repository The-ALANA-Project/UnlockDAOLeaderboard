import { Menu, X, Linkedin, Youtube, Github, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-consensus-cream border-b border-[#020207]">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center">
          <span className="text-2xl font-semibold">Ʉnlock Protocol</span>
        </div>
      </nav>
    </header>
  );
}