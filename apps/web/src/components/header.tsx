import { Link } from "@tanstack/react-router";
import { SidebarTrigger } from "@testery/ui/components/sidebar";

export default function Header() {
  return (
    <div className="border-b backdrop-blur">
      <div className="flex min-h-14 flex-row items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div>
            <Link to="/">
              <p className="text-sm font-medium">Testery</p>
              <p className="text-muted-foreground text-xs">Piscine overview</p>
            </Link>
          </div>
        </div>
        <nav className="flex gap-4 text-sm"></nav>
      </div>
    </div>
  );
}
