import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

const Header = ({ title, className }: HeaderProps) => {
  return (
    <header className={cn("mb-6 sm:mb-8", className)}>
      <h1 className="text-h1 font-inter mb-2">
        {title}
      </h1>          
    </header>
  );
};

export default Header;
