import { motion } from 'framer-motion';
import { TrendingDown, Clock, MapPin, AlertCircle } from 'lucide-react';
import { places, getCrowdColor, getCategoryIcon } from '@/data/places';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CrowdIndicatorProps {
  onPlaceSelect: (placeId: string) => void;
}

const CrowdIndicator = ({ onPlaceSelect }: CrowdIndicatorProps) => {
  // Simulate crowd-based recommendations
  const getCurrentTimeRecommendations = () => {
    const hour = new Date().getHours();
    const isWeekend = [0, 6].includes(new Date().getDay());

    // Filter low crowd places
    const lowCrowdPlaces = places.filter(p => p.crowdLevel === 'low');
    
    // Recommend based on time
    if (hour >= 5 && hour < 9) {
      // Early morning - recommend nature spots
      return {
        timeContext: 'Early Morning',
        message: 'Perfect time for nature walks and birdwatching!',
        recommended: lowCrowdPlaces.filter(p => p.category === 'nature'),
      };
    } else if (hour >= 9 && hour < 12) {
      // Morning - recommend artisan visits
      return {
        timeContext: 'Morning',
        message: 'Artisans are at work - great time to visit workshops!',
        recommended: lowCrowdPlaces.filter(p => p.category === 'art'),
      };
    } else if (hour >= 12 && hour < 16) {
      // Afternoon - recommend indoor heritage
      return {
        timeContext: 'Afternoon',
        message: 'Avoid peak heat - explore indoor heritage sites.',
        recommended: lowCrowdPlaces.filter(p => p.category === 'heritage'),
      };
    } else if (hour >= 16 && hour < 19) {
      // Evening - recommend cultural walks
      return {
        timeContext: 'Evening',
        message: 'Golden hour - perfect for heritage walks and food trails!',
        recommended: lowCrowdPlaces.filter(p => ['culture', 'food'].includes(p.category)),
      };
    } else {
      // Night
      return {
        timeContext: 'Evening/Night',
        message: 'Limited options - plan your morning adventure!',
        recommended: lowCrowdPlaces.slice(0, 3),
      };
    }
  };

  const { timeContext, message, recommended } = getCurrentTimeRecommendations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="border-heritage-gold/30 bg-gradient-to-br from-heritage-gold/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-silk-green" />
              Smart Crowd Avoidance
            </CardTitle>
            <Badge className="bg-silk-green text-accent-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {timeContext}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Current Recommendation */}
          <div className="bg-muted rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-heritage-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Right Now
                </p>
                <p className="text-sm text-muted-foreground">
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Places */}
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Recommended Low-Crowd Spots
          </p>
          
          <div className="space-y-2">
            {recommended.slice(0, 4).map((place) => (
              <div
                key={place.id}
                onClick={() => onPlaceSelect(place.id)}
                className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-muted cursor-pointer transition-colors group"
              >
                <span className="text-xl">{getCategoryIcon(place.category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {place.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {place.bestTime}
                  </p>
                </div>
                <Badge className={`${getCrowdColor(place.crowdLevel)} text-xs flex-shrink-0`}>
                  Low
                </Badge>
              </div>
            ))}
          </div>

          {recommended.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Check back during different hours for personalized recommendations!
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CrowdIndicator;
