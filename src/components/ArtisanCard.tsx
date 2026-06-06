import { motion } from 'framer-motion';
import { MapPin, Clock, Quote } from 'lucide-react';
import { Artisan, getCraftIcon, getCraftColor } from '@/data/artisans';
import { getArtisanImage } from '@/data/artisanImages';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ArtisanCardProps {
  artisan: Artisan;
  onClick: () => void;
  index?: number;
}

const ArtisanCard = ({ artisan, onClick, index = 0 }: ArtisanCardProps) => {
  const artisanImage = getArtisanImage(artisan.id, artisan.image);

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
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={artisanImage}
            alt={`${artisan.name} - ${artisan.specialty}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Craft Badge Overlay */}
          <div className="absolute top-3 left-3">
            <Badge className={`${getCraftColor(artisan.craft)} text-xs font-medium capitalize shadow-lg`}>
              <span className="mr-1">{getCraftIcon(artisan.craft)}</span>
              {artisan.craft}
            </Badge>
          </div>

          {/* Name Overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-serif text-lg font-semibold text-white drop-shadow-lg line-clamp-1">
              {artisan.name}
            </h3>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Specialty */}
          <p className="text-sm font-medium text-foreground mb-2 line-clamp-2">
            {artisan.specialty}
          </p>

          {/* Story Quote */}
          <div className="relative bg-muted rounded-lg p-3 mb-3">
            <Quote className="absolute top-2 left-2 w-3 h-3 text-heritage-gold opacity-50" />
            <p className="text-xs text-muted-foreground italic pl-4 line-clamp-2">
              "{artisan.story}"
            </p>
          </div>

          {/* Info */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{artisan.experience}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{artisan.location}</span>
            </div>
          </div>

          {/* Products */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {artisan.products.slice(0, 3).map((product) => (
              <span 
                key={product}
                className="text-xs px-2 py-0.5 rounded-full bg-heritage-gold/10 text-heritage-maroon border border-heritage-gold/20"
              >
                {product}
              </span>
            ))}
          </div>

          {/* View on Map Button */}
          <Button 
            variant="outline"
            size="sm"
            className="w-full border-heritage-gold/30 text-heritage-maroon hover:bg-heritage-gold/10"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <MapPin className="w-3.5 h-3.5 mr-2" />
            View on Map
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ArtisanCard;
