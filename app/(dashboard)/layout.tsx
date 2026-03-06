import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { RefreshProvider } from "@/store/refresh-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RefreshProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopBar />
          <main className="max-w-full flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RefreshProvider>
  );
}
