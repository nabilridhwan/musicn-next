'use client';

import {getMe} from '@/api/getMe';
import Link from 'next/link';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/menu';
import {Avatar, Button, HStack, Icon, Text} from '@chakra-ui/react';
import {ChevronDownIcon} from 'lucide-react';
import {IoCog, IoPerson} from 'react-icons/io5';

interface LoggedInNavigationItemsProps {
  profile: Awaited<ReturnType<typeof getMe>>;
}

export const LoggedInNavigationItems = ({
  profile,
}: LoggedInNavigationItemsProps) => {
  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          variant={'ghost'}
          rightIcon={<ChevronDownIcon size={14} />}>
          <HStack>
            <Avatar
              size={'sm'}
              src={profile?.spotify_users?.profile_pic_url || undefined}
              name={'dk'}
            />

            <Text>{profile?.name || profile?.username}</Text>
          </HStack>
        </MenuButton>
        <MenuList>
          <Link href={'/profile'}>
            <MenuItem>
              <Icon mr={2}>
                <IoCog size={25} />
              </Icon>
              Account Settings
            </MenuItem>
          </Link>

          <Link href={`/@${profile?.username}`}>
            <MenuItem>
              <Icon mr={2}>
                <IoPerson size={25} />
              </Icon>
              Musicn Profile
            </MenuItem>
          </Link>

          <MenuDivider />

          <Link href={'/api/logout'}>
            <MenuItem color={'red.500'}>Logout</MenuItem>
          </Link>
        </MenuList>
      </Menu>
      {/*<DropdownMenu>*/}
      {/*  <DropdownMenuTrigger className={'absolute'}>*/}
      {/*    <Avatar>*/}
      {/*      <AvatarImage*/}
      {/*        src={profile?.spotify_users?.profile_pic_url || undefined}*/}
      {/*      />*/}
      {/*    </Avatar>*/}
      {/*  </DropdownMenuTrigger>*/}

      {/*  <DropdownMenuContent className={'relative'}>*/}
      {/*    <DropdownMenuItem>*/}
      {/*      <Link href={`/profile`}>My Account</Link>*/}
      {/*    </DropdownMenuItem>*/}

      {/*    <DropdownMenuItem>*/}
      {/*      <Link href={``}></Link>*/}
      {/*    </DropdownMenuItem>*/}

      {/*    <DropdownMenuSeparator />*/}

      {/*    <DropdownMenuItem>*/}
      {/*      <Link href={'/api/logout'} className={'text-red-500'}>*/}
      {/*        Logout*/}
      {/*      </Link>*/}
      {/*    </DropdownMenuItem>*/}
      {/*  </DropdownMenuContent>*/}
      {/*</DropdownMenu>*/}
    </>
  );
};
