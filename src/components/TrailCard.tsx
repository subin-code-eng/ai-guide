import { motion } from 'framer-motion';
import { Clock, MapPin, Route, Users } from 'lucide-react';
import { Trail, getTrailIcon } from '@/data/trails';
import { getTrailImage } from '@/data/trailImages';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TrailCardProps {
  trail: Trail;
  onViewOnMap: () => void;
  index?: number;
}

const TrailCard = ({ trail, onViewOnMap, index = 0 }: TrailCardProps) => {
  const trailImage = getTrailImage(trail.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
    >
      <Card className="group overflow-hidden border-border hover:shadow-elevated transition-all duration-300">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-72 h-48 lg:h-auto relative overflow-hidden">
              <img
                src={trailImage}
                alt={trail.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent lg:bg-gradient-to-b" />
              
              {/* Trail Icon Overlay */}
              <div className="absolute top-4 left-4 w-14 h-14 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <span className="text-3xl">{getTrailIcon(trail.id)}</span>
              </div>

              {/* Stats Overlay for Mobile */}
              <div className="absolute bottom-3 left-3 flex gap-2 lg:hidden">
                <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {trail.duration}
                </Badge>
                <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground text-xs">
                  <Route className="w-3 h-3 mr-1" />
                  {trail.distance}
                </Badge>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6">
              {/* Header */}
              <div className="mb-3">
                <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {trail.name}
                </h3>
                <p className="text-sm text-heritage-gold font-medium italic">
                  {trail.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {trail.description}
              </p>

              {/* Stats - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-heritage-gold" />
                  <span>{trail.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Route className="w-3.5 h-3.5 text-heritage-gold" />
                  <span>{trail.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-heritage-gold" />
                  <span>{trail.stops.length} stops</span>
                </div>
              </div>

              {/* Stops Preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {trail.stops.slice(0, 3).map((stop, idx) => (
                  <span 
                    key={stop}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {idx + 1}. {stop}
                  </span>
                ))}
                {trail.stops.length > 3 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    +{trail.stops.length - 3} more
                  </span>
                )}
              </div>

              {/* Best For */}
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-1.5">
                  {trail.bestFor.map((audience) => (
                    <Badge 
                      key={audience}
                      variant="outline"
                      className="text-xs border-heritage-gold/30 text-heritage-maroon"
                    >
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Button 
                onClick={onViewOnMap}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                <MapPin className="w-4 h-4 mr-2" />
                View Trail on Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrailCard;
