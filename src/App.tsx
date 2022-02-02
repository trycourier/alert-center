import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "@chakra-ui/react";

import PageHeader from "./components/PageHeader";
import PageTabs from "./components/PageTabs";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <Container py={{ base: 6, md: 10 }}>
      <PageHeader />

      {isAuthenticated && <PageTabs />}
    </Container>
  );
}

export default App;
