import { motion } from 'framer-motion';
import { MapPin, Users, Palette, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onExplore: () => void;
  onViewMap: () => void;
}

const HeroSection = ({ onExplore, onViewMap }: HeroSectionProps) => {
  const stats = [
    { icon: MapPin, value: '12+', label: 'Hidden Gems' },
    { icon: Users, value: '6+', label: 'Local Artisans' },
    { icon: Palette, value: '5', label: 'Cultural Trails' },
    { icon: TreePine, value: '3', label: 'Nature Spots' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 heritage-gradient" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-heritage-gold blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-silk-green blur-3xl" />
      </div>

      {/* Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground shadow-gold">
              Decentralising Tourism
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
          >
            Mysuru{' '}
            <span className="text-gradient-gold">Beyond</span>
            <br />
            Palaces
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            While millions crowd the Palace, local artisans struggle for visibility and 
            cultural traditions fade. We're changing that — redistributing tourist attention 
            to hidden gems, master craftspeople, and authentic experiences.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button 
              size="lg"
              onClick={onExplore}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 py-6 text-lg shadow-gold"
            >
              Explore Hidden Gems
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={onViewMap}
              className="border-white bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg backdrop-blur-sm"
            >
              <MapPin className="w-5 h-5 mr-2" />
              View Live Map
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass-card rounded-xl p-4 text-center"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-heritage-gold" />
                <div className="font-serif text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 rounded-full bg-white/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
