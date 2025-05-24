import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Link, useLocation } from '@tanstack/react-router';
import { NavUser } from './nav-user';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Planilhas',
      url: '#',
      items: [
        {
          title: 'Arquivos',
          url: '/planilhas/arquivos',
        },
        {
          title: 'Pesquisar',
          url: '/planilhas/pesquisa',
        },
      ],
    },
    // {
    //   title: "PDF",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Arquivos",
    //       url: "#",
    //       isActive: true,
    //     },
    //     {
    //       title: "Pesquisar",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
};

// Memoized Navigation Item component
const NavItem = ({
  item,
  isActive,
}: {
  item: { title: string; url: string };
  isActive: boolean;
}) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild isActive={isActive}>
      <Link to={item.url}>{item.title}</Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

NavItem.displayName = 'NavItem';

// Memoized Navigation Group component
const NavGroup = ({
  group,
  currentPath,
}: {
  group: {
    title: string;
    url: string;
    items: { title: string; url: string }[];
  };
  currentPath: string;
}) => (
  <SidebarGroup>
    <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {group.items.map((item) => (
          <NavItem
            key={item.title}
            item={item}
            isActive={currentPath === item.url}
          />
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

NavGroup.displayName = 'NavGroup';

// Main component with React.memo
const AppSidebarInner = function AppSidebarInner({
  path,
  ...props
}: {
  path: string;
} & React.ComponentProps<typeof Sidebar>) {
  // useRenderCounter();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <NavGroup key={item.title} group={item} currentPath={path} />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

// Wrapper component that gets the router state
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const path = pathname;

  return <AppSidebarInner path={path} {...props} />;
}
