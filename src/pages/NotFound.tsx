import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="ml-80 p-8 min-h-screen flex items-center justify-center animate-fade-in">
      <div className="text-center max-w-2xl">
        <div className="glass-effect p-12 rounded-3xl">
          <div className="mb-6">
            <div className="p-4 rounded-2xl gradient-primary inline-block mb-4">
              <h1 className="text-6xl">🛠️</h1>
            </div>
            <h1 className="text-4xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
              Page Not Found
            </h1>
            <p className="text-xl text-muted-foreground">
              The page you're looking for doesn't exist in our Dev Toolbox.
            </p>
          </div>
          
          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-primary-foreground rounded-xl font-medium hover-scale transition-all duration-300"
          >
            Return to JSON Formatter
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
