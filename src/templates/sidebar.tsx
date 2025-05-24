import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useLocation } from '@tanstack/react-router';
import { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

const PathBreadcrumb = ({ path }: { path: string[] }) => {
  //useRenderCounter();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#" className="capitalize">
            {path[0]}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {path.length > 1 && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">{path[1]}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const Sidebar = ({ children }: SidebarProps) => {
  const { pathname } = useLocation();
  const path = pathname.slice(1).split('/');

  // useRenderCounter();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PathBreadcrumb path={path} />
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Sidebar;
