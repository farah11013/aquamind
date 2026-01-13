import { Link } from 'react-router-dom';
import { Waves } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Waves className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">BlueWave</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              A comprehensive AI-enabled platform for marine research and management, supporting sustainable fisheries and marine ecosystem conservation.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/visualizations" className="hover:text-primary transition-colors">Visualizations</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link to="/api" className="hover:text-primary transition-colors">API Docs</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About BlueWave</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Marine Research</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2026 BlueWave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
