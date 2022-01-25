import { useAuth0 } from "@auth0/auth0-react";
import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Input,
  Tag,
  AlertTitle,
  AlertDescription,
  Alert,
  AlertIcon,
  Code,
  Link,
  CloseButton,
} from "@chakra-ui/react";
import { ReactComponent as Logo } from "./logo.svg";

function App() {
  const { loginWithRedirect, logout, isLoading, isAuthenticated, user } =
    useAuth0();

  return (
    <Container py={{ base: 6, md: 10 }}>
      <Flex
        mb={8}
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
            onClick={
              isAuthenticated ? () => logout() : () => loginWithRedirect()
            }
            colorScheme="purple"
            variant={isAuthenticated ? "outline" : "solid"}
          >
            {isAuthenticated ? "Log out" : "Log In"}
          </Button>
        </Flex>
      </Flex>

      {isAuthenticated && (
        <>
          <Alert
            my={8}
            status="info"
            variant="left-accent"
            alignItems="flex-start"
            colorScheme="gray"
          >
            <AlertIcon />
            <Box>
              <AlertTitle mb={1}>Stripe Webhook URL</AlertTitle>
              <AlertDescription>
                Create a{" "}
                <Link
                  href="https://dashboard.stripe.com/test/webhooks/create"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Stripe Webhook
                </Link>{" "}
                with following Endpoint URL and select{" "}
                <Code colorScheme="blackAlpha">charge.succeeded</Code> event to
                listen to.
              </AlertDescription>
              <Input
                mt={2}
                value={`${process.env.REACT_APP_VERCEL_URL}/api/stripe-webhook`}
                variant="outline"
                readOnly
                bgColor="white"
              />
              <CloseButton position="absolute" right={2} top={2} />
            </Box>
          </Alert>
        </>
      )}
    </Container>
  );
}

export default App;
