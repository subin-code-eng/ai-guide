import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { Place, getCrowdColor, getCategoryIcon, getCategoryColor } from '@/data/places';
import { getPlaceImage } from '@/data/placeImages';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
  index?: number;
}

const PlaceCard = ({ place, onClick, index = 0 }: PlaceCardProps) => {
  const placeImage = getPlaceImage(place.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card 
        className="group cursor-pointer overflow-hidden border-border hover:shadow-elevated transition-all duration-300 h-full"
        onClick={onClick}
      >
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent z-10" />
          
          {/* Place Image */}
          <img 
            src={placeImage} 
            alt={place.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-20">
            <Badge className={`${getCategoryColor(place.category)} text-xs font-medium`}>
              {getCategoryIcon(place.category)} {place.category}
            </Badge>
          </div>

          {/* Crowd Level */}
          <div className="absolute top-3 right-3 z-20">
            <Badge className={`${getCrowdColor(place.crowdLevel)} text-xs font-medium capitalize`}>
              {place.crowdLevel} crowd
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {place.name}
          </h3>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {place.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{place.bestTime}</span>
            </div>
          </div>

          {/* Highlights Preview */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {place.highlights.slice(0, 2).map((highlight) => (
              <span 
                key={highlight}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                {highlight}
              </span>
            ))}
            {place.highlights.length > 2 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{place.highlights.length - 2} more
              </span>
            )}
          </div>

          {/* Redirect Message for High Crowd Places */}
          {place.crowdLevel === 'high' && place.redirectMessage && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                💡 {place.redirectMessage}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlaceCard;
