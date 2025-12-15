import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

const PageHeader = ({ title, breadcrumbs = [], className }: PageHeaderProps) => {
  return (
    <header className={cn("mb-6 sm:mb-8", className)}>
      <h1 className="text-h3-bold sm:text-h2-bold font-inter text-primary mb-2">
        {title}
      </h1>
      
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-small font-open-sans">
          <a 
            href="/" 
            className="text-grayscale-60 hover:text-primary transition-colors"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </a>
          
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-grayscale-40" />
              {item.href ? (
                <a 
                  href={item.href}
                  className="text-grayscale-60 hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-grayscale-60">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
};

export default PageHeader;
