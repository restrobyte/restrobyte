import { Box, Text } from "@chakra-ui/react";

function Footer() {
  return (
    <Box
      as="footer"
      width="100%"
      textAlign="center"
      py={1}
      bg="rgba(255, 255, 255, 0.4)"
      backdropFilter="blur(8px)"
      color="grey"
      position="fixed"
      bottom={0}
    >
      <Text fontSize={{ base: "sm", md: "md" }}>
        Made with ❤️ by SS
      </Text>
    </Box>
  );
}

export default Footer;
