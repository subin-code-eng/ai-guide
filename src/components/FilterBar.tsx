import { motion } from 'framer-motion';
import { PlaceCategory } from '@/data/places';
import { Button } from '@/components/ui/button';

interface FilterBarProps {
  activeFilter: PlaceCategory | 'all';
  onFilterChange: (filter: PlaceCategory | 'all') => void;
  crowdFilter: 'all' | 'low' | 'medium' | 'high';
  onCrowdFilterChange: (filter: 'all' | 'low' | 'medium' | 'high') => void;
}

const FilterBar = ({ activeFilter, onFilterChange, crowdFilter, onCrowdFilterChange }: FilterBarProps) => {
  const categories: { id: PlaceCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Places', icon: '🗺️' },
    { id: 'heritage', label: 'Heritage', icon: '🏛️' },
    { id: 'art', label: 'Art & Craft', icon: '🎨' },
    { id: 'nature', label: 'Nature', icon: '🌿' },
    { id: 'food', label: 'Food', icon: '🍛' },
    { id: 'culture', label: 'Culture', icon: '🪔' },
  ];

  const crowdLevels: { id: 'all' | 'low' | 'medium' | 'high'; label: string }[] = [
    { id: 'all', label: 'Any Crowd' },
    { id: 'low', label: 'Low Crowd' },
    { id: 'medium', label: 'Medium' },
    { id: 'high', label: 'Popular' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border rounded-xl p-4 shadow-card"
    >
      {/* Category Filters */}
      <div className="mb-4">
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeFilter === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(cat.id)}
              className={activeFilter === cat.id 
                ? 'bg-primary text-primary-foreground' 
                : 'border-border hover:bg-muted'
              }
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Crowd Level Filters */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          Crowd Level
        </p>
        <div className="flex flex-wrap gap-2">
          {crowdLevels.map((level) => (
            <Button
              key={level.id}
              variant={crowdFilter === level.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCrowdFilterChange(level.id)}
              className={crowdFilter === level.id 
                ? level.id === 'low' 
                  ? 'bg-silk-green text-accent-foreground'
                  : level.id === 'medium'
                    ? 'bg-secondary text-secondary-foreground'
                    : level.id === 'high'
                      ? 'bg-heritage-maroon text-primary-foreground'
                      : 'bg-primary text-primary-foreground'
                : 'border-border hover:bg-muted'
              }
            >
              {level.label}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;
