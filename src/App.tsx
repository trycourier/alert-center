import { useAuth0 } from "@auth0/auth0-react";
import { Container, Box, Heading, Text, Button } from "@chakra-ui/react";
import { ReactComponent as Logo } from "./logo.svg";

function App() {
  const { loginWithRedirect, logout, isLoading, isAuthenticated, user } =
    useAuth0();

  return (
    <Container py={10} textAlign="center">
      <Box maxW={32} mx="auto">
        <Logo />
      </Box>

      <Heading my={8}>Alert Center</Heading>

      <Button
        isLoading={isLoading}
        onClick={isAuthenticated ? () => logout() : () => loginWithRedirect()}
        colorScheme="purple"
        variant={isAuthenticated ? "outline" : "solid"}
      >
        {isAuthenticated ? "Log out" : "Log In"}
      </Button>

      {isAuthenticated && <Text mt={4}>Hi, {user?.name}</Text>}
    </Container>
  );
}

export default App;
