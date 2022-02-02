import { useAuth0 } from "@auth0/auth0-react";
import { Flex, Box, Heading, Text, Button, Tag } from "@chakra-ui/react";

import { ReactComponent as Logo } from "./logo.svg";

const PageHeader = () => {
  const { loginWithRedirect, logout, isLoading, isAuthenticated, user } =
    useAuth0();

  return (
    <Flex
      mb={{ base: 4, md: 8 }}
      direction={{ base: "column", md: "row" }}
      alignItems="center"
    >
      <Flex alignItems="flex-end">
        <Box w={32}>
          <Logo />
        </Box>
        <Tag ml={4} colorScheme="purple">
          <Heading as="h1" size="sm">
            Alert Center
          </Heading>
        </Tag>
      </Flex>

      <Flex ml={{ md: "auto" }} pt={{ base: 6, md: 0 }} alignItems="center">
        <Text mr={2}>{user && `Hi, ${user.given_name}!`}</Text>

        <Button
          size="sm"
          isLoading={isLoading}
          onClick={isAuthenticated ? () => logout() : () => loginWithRedirect()}
          colorScheme="purple"
          variant={isAuthenticated ? "outline" : "solid"}
        >
          {isAuthenticated ? "Log out" : "Log In"}
        </Button>
      </Flex>
    </Flex>
  );
};

export default PageHeader;
