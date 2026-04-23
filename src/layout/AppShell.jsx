import { useState } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { SidebarNav } from "./components/SidebarNav";
import { TopBar } from "./components/TopBar";

function getActiveHandle(matches) {
  return [...matches].reverse().find((match) => match.handle)?.handle ?? {};
}

export function AppShell() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const matches = useMatches();
  const activeHandle = getActiveHandle(matches);
  const { admin, logout } = useAuth();

  return (
    <div className="app-shell">
      <SidebarNav
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-shell__main">
        <TopBar
          admin={admin}
          onLogout={logout}
          onMenuOpen={() => setSidebarOpen(true)}
          searchPlaceholderKey={activeHandle.searchPlaceholderKey}
        />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
