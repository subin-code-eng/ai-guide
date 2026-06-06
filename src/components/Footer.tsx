import { motion } from 'framer-motion';
import { Heart, ExternalLink, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
                <MapPin className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">Mysuru Beyond Palaces</h3>
                <p className="text-sm text-background/60">Decentralised Tourism Platform</p>
              </div>
            </div>
            <p className="text-sm text-background/70 max-w-md mb-4">
              Empowering local artisans, preserving cultural heritage, and creating sustainable 
              tourism by distributing visitor flow across Mysuru's hidden treasures.
            </p>
            <div className="flex items-center gap-2 text-sm text-background/60">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-heritage-gold fill-heritage-gold" />
              <span>for Mysuru</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-heritage-gold transition-colors">Hidden Gems</a></li>
              <li><a href="#" className="hover:text-heritage-gold transition-colors">Local Artisans</a></li>
              <li><a href="#" className="hover:text-heritage-gold transition-colors">Cultural Trails</a></li>
              <li><a href="#" className="hover:text-heritage-gold transition-colors">Interactive Map</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-heritage-gold transition-colors">Our Mission</a></li>
              <li><a href="#" className="hover:text-heritage-gold transition-colors">For Artisans</a></li>
              <li><a href="#" className="hover:text-heritage-gold transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-heritage-gold transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © 2026 Mysuru Beyond Palaces. Promoting sustainable tourism.
          </p>
          <div className="flex items-center gap-4 text-sm text-background/50">
            <span>Open Source</span>
            <span>•</span>
            <span>Free Data</span>
            <span>•</span>
            <span>Community Driven</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
