'use client';

import {getMe} from '@/api/getMe';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LoggedInNavigationItemsProps {
  profile: Awaited<ReturnType<typeof getMe>>;
}

export const LoggedInNavigationItems = ({
  profile,
}: LoggedInNavigationItemsProps) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={'absolute'}>
          <Avatar>
            <AvatarImage
              src={profile?.spotify_users?.profile_pic_url || undefined}
            />
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className={'relative'}>
          <DropdownMenuItem>
            <Link href={`/profile`}>My Account</Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href={`/@${profile?.username}`}>Musicn Profile</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Link href={'/api/logout'} className={'text-red-500'}>
              Logout
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
