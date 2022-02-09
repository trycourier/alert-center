import {
  Box,
  AlertTitle,
  AlertDescription,
  Alert,
  AlertIcon,
  CloseButton,
  Tooltip,
} from "@chakra-ui/react";

interface SetupBannerProps {
  title: string;
}

const SetupBanner = ({
  title,
  children,
}: React.PropsWithChildren<SetupBannerProps>) => {
  if (process.env.REACT_APP_HIDE_SETUP_BANNERS) return null;

  return (
    <Alert
      mb={6}
      status="info"
      variant="left-accent"
      alignItems="flex-start"
      colorScheme="gray"
      fontSize="sm"
    >
      <AlertIcon w={4} />

      <Box>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{children}</AlertDescription>
      </Box>

      <Tooltip
        label="Set REACT_APP_HIDE_SETUP_BANNERS environment variable to hide this banner"
        placement="start-start"
        hasArrow
      >
        <Box position="absolute" right={2} top={2}>
          <CloseButton isDisabled />
        </Box>
      </Tooltip>
    </Alert>
  );
};

export default SetupBanner;
