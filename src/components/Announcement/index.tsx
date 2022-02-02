import {
  Box,
  AlertTitle,
  AlertDescription,
  Alert,
  AlertIcon,
  CloseButton,
  Tooltip,
} from "@chakra-ui/react";

interface AnnouncementProps {
  title: string;
}

const Announcement = ({
  title,
  children,
}: React.PropsWithChildren<AnnouncementProps>) => {
  if (process.env.REACT_APP_HIDE_ANNOUNCEMENTS) return null;

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
        label="Set REACT_APP_HIDE_ANNOUNCEMENTS environment variable to hide announcements"
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

export default Announcement;
