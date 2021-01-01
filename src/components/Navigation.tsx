import React from 'react';
import { Grid, Text, Link, Flex, Menu, MenuButton, MenuItem, MenuList, Icon } from '@chakra-ui/react';
import NextLink from 'next/link';
import { GithubRoute, HomeRoute, AuthRoute } from '../routes';
import { FaBars } from 'react-icons/fa';
import { useRouter } from 'next/dist/client/router';
import { FaGithub, FaSignInAlt, FaHome } from 'react-icons/fa';
import { IconType } from 'react-icons';
import ColorModeButton from './ColorModeButton';
import useSmallLayout from '../hooks/useSmallLayout';

type LinkTextProps = {
  children: React.ReactNode;
  href: string;
  icon: IconType;
};

const LinkText: React.FC<LinkTextProps> = ({ children, href, icon }: LinkTextProps) => {
  if (href.includes('://')) {
    return (
      <Text
        as="span"
        align="left"
        opacity="0.8"
        letterSpacing={'-.1rem'}
        _hover={{ opacity: '1' }}
        fontSize={['1.4em', '1.5em', '1.6em', '1.7em']}
      >
        <Link href={href} isExternal>
          <Flex as="p" gridGap="0.3em" alignItems="center">
            <Icon as={icon} />
            {children}
          </Flex>
        </Link>
      </Text>
    );
  }

  return (
    <Text
      as="span"
      align="left"
      opacity="0.8"
      letterSpacing={'-.1rem'}
      _hover={{ opacity: '1' }}
      fontSize={['1.4em', '1.5em', '1.6em', '1.7em']}
    >
      <NextLink href={href}>
        <Link>
          <Flex as="p" gridGap="0.3em" alignItems="center">
            <Icon as={icon} />
            {children}
          </Flex>
        </Link>
      </NextLink>
    </Text>
  );
};

const InlineNavigation = () => (
  <Grid gridGap="5em">
    <ColorModeButton />
    <LinkText href={HomeRoute} icon={FaHome}>
      Home
    </LinkText>
    <LinkText href={AuthRoute} icon={FaSignInAlt}>
      Sign in
    </LinkText>
    <LinkText href={GithubRoute} icon={FaGithub}>
      Github
    </LinkText>
  </Grid>
);

const BurgerNavigation = () => {
  const router = useRouter();

  const pushFunction = (path: string) => () => {
    router.push(path);
  };

  return (
    <Flex justifyContent="space-between">
      <ColorModeButton />
      <Menu>
        <MenuButton fontSize="3em">
          <Flex alignItems="top">
            <Icon as={FaBars} />
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={pushFunction(HomeRoute)}>
            <LinkText icon={FaHome} href={HomeRoute}>
              Home
            </LinkText>
          </MenuItem>
          <MenuItem onClick={pushFunction(AuthRoute)}>
            <LinkText icon={FaSignInAlt} href={AuthRoute}>
              Sign in
            </LinkText>
          </MenuItem>
          <MenuItem onClick={pushFunction(GithubRoute)}>
            <LinkText icon={FaGithub} href={GithubRoute}>
              Github
            </LinkText>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

const Navigation: React.FC = () => {
  const isSmallLayout = useSmallLayout();

  return isSmallLayout ? <BurgerNavigation /> : <InlineNavigation />;
};

export default Navigation;
