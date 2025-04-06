
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Home, 
  Upload, 
  LineChart, 
  LightbulbIcon
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Upload Data", href: "/upload", icon: Upload },
  { title: "Visualize", href: "/visualize", icon: LineChart },
  { title: "Recommendations", href: "/recommendations", icon: LightbulbIcon },
];

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-finance-secondary flex flex-col transition-all duration-300 ease-in-out transform",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
      )}
    >
      <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 h-16 border-b border-gray-700">
        <Link to="/" className="flex items-center">
          <BarChart3 className="h-8 w-8 text-finance-primary" />
          {open && (
            <span className="ml-2 text-xl font-bold text-white">SmartSpend</span>
          )}
        </Link>
      </div>

      <div className="flex flex-col flex-grow overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-white rounded-md hover:bg-finance-secondary/80 transition-colors",
                !open && "justify-center"
              )}
              title={item.title}
            >
              <item.icon className={cn("h-6 w-6", !open ? "mx-auto" : "mr-3")} />
              {open ? <span>{item.title}</span> : (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                  {item.title}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-shrink-0 p-4 border-t border-gray-700">
        <button 
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md text-white hover:bg-gray-700"
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
