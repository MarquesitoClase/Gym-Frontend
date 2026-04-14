import { useState } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { SidebarNav } from "./components/SidebarNav";
import { TopBar } from "./components/TopBar";

function getActiveHandle(matches) {
  return [...matches].reverse().find((match) => match.handle)?.handle ?? {};
}

export function AppShell() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const matches = useMatches();
  const activeHandle = getActiveHandle(matches);

  return (
    <div className="app-shell">
      <SidebarNav
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-shell__main">
        <TopBar
          onMenuOpen={() => setSidebarOpen(true)}
          searchPlaceholder={activeHandle.searchPlaceholder}
        />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
