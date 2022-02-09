import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import StripeSubscriptionPreferences from "../StripeSubscriptionPreferences";

const tabs = [
  {
    name: "stripe",
    title: "Stripe Charge Notifications",
    component: StripeSubscriptionPreferences,
  },
];

const PageTabs = () => {
  return (
    <Tabs colorScheme="purple" isFitted>
      <TabList>
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            fontWeight={600}
            justifyContent={{ base: "center", md: "flex-start" }}
            px={0}
          >
            {tab.title}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {tabs.map((tab) => (
          <TabPanel key={tab.name} px={0}>
            {<tab.component />}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default PageTabs;
