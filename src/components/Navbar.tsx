import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, MapPin, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Navbar = ({ activeSection, onNavigate }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Guest';

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'artisans', label: 'Artisans' },
    { id: 'trails', label: 'Trails' },
    { id: 'map', label: 'Map' },
    { id: 'feedback', label: 'Feedback' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 rounded-full heritage-gradient flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg font-bold text-foreground leading-tight">
                Mysuru Beyond
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Decentralised Tourism</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className={activeSection === item.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-muted'
                }
              >
                {item.label}
              </Button>
            ))}

            {user ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                <Button asChild variant="outline" size="sm">
                  <Link to="/register-artisan">Register as Artisan</Link>
                </Button>
                <span className="text-sm text-muted-foreground hidden lg:flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5" />
                  {displayName}
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/register-artisan">Register as Artisan</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link to="/auth">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Sign In
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </Button>
              ))}
              {user ? (
                <Button variant="outline" className="justify-start" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button asChild variant="default" className="justify-start">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
