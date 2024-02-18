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

interface LoggedInNavigationItemsProps {
  profile: Awaited<ReturnType<typeof getMe>>;
}

// <Menu>
//   <MenuButton
//       variant={'link'}
//       as={Button}
//       rounded={'full'}
//       w={'fit-content'}>
//     <HStack>
//       <Avatar
//           size={'xs'}
//           name={profile?.name || undefined}
//           src={profile?.spotify_users?.profile_pic_url || undefined}
//       />
//
//       <Text fontSize={'sm'}>{profile?.name}</Text>
//     </HStack>
//   </MenuButton>
//
//   <MenuList>
//     <MenuItem>
//       <Link href={'/profile'}>Account Settings</Link>
//     </MenuItem>
//
//     <MenuItem>
//       <Link href={`/@${profile?.username}`}>Musicn Profile</Link>
//     </MenuItem>
//
//     {/*<MenuItem>*/}
//     {/*  <Link href={'/gridify'}>Gridify</Link>*/}
//     {/*</MenuItem>*/}
//
//     <MenuDivider />
//
//     <MenuItem>
//       <Link href={'/api/logout'}>Logout</Link>
//     </MenuItem>
//   </MenuList>
// </Menu>

export const LoggedInNavigationItems = ({
  profile,
}: LoggedInNavigationItemsProps) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Avatar>
              <AvatarImage
                src={profile?.spotify_users?.profile_pic_url || undefined}
              />
            </Avatar>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink>
              <Link href={'/profile'}>Account Settings</Link>
            </NavigationMenuLink>

            <NavigationMenuLink>
              <Link href={`/@${profile?.username}`}>Musicn Profile</Link>
            </NavigationMenuLink>

            <NavigationMenuLink>
              <Link href={'/api/logout'}>Logout</Link>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
