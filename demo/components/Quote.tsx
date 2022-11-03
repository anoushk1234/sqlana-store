import { StarIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex, chakra, Text, HStack, Box } from "@chakra-ui/react";
import Avatar from "boring-avatars";
export const Quote = ({ address, key, quote }: any) => {
  // const upvotes = 10;
  // const upvoted = true;
  // const address = "0x1234567890w23456789012345678901234567890";
  return (
    <Flex
      key={key}
      maxW="md"
      mx="auto"
      bg="black"
      shadow="lg"
      rounded="xl"
      overflow="hidden"
      borderWidth={1}
      borderColor="hsla(0,0%,83%,.2)"
      alignItems={"center"}
      mt="6"
      px="2"
      pl="4"
    >
      <Avatar
        size={40}
        name={address}
        variant="sunset"
        colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
      />

      <Flex align="center">
        <Box
          // w={2 / 3}
          px={{
            base: 4,
            md: 4,
          }}
          pb={{
            base: 4,
            md: 4,
          }}
          pt={{
            base: 4,
            md: 2,
          }}
        >
          {/* <chakra.h1 fontSize="2xl" fontWeight="bold" color="gray.800">
          Backpack
        </chakra.h1> */}

          <chakra.p mt={2} fontSize="md" color="white" fontStyle="italic">
            &quot;{quote}&quot;
          </chakra.p>
          <chakra.p mt={2} fontSize="sm" color="GrayText">
            {address.slice(0, 5) + "..." + address.slice(-5)}
          </chakra.p>
        </Box>
        {/* <Box
          borderColor={upvoted ? "green.500" : "gray"}
          borderWidth="1px"
          py="2"
          px="4"
          borderRadius="lg"
          mr="4"
          display="flex"
          flexDirection="column"
          alignItems="center"
          color={upvoted ? "green.500" : "gray"}
        >
          <TriangleUpIcon />
          <Text>{upvotes}</Text>
        </Box> */}
      </Flex>
    </Flex>
  );
};
