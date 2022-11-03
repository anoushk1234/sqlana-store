import {
  SimpleGrid,
  Box,
  Text,
  GridItem,
  Heading,
  chakra,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Input,
  Textarea,
  FormHelperText,
  Flex,
  Icon,
  Button,
  VisuallyHidden,
  Divider,
  Select,
  Checkbox,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import Avatar from "boring-avatars";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useState } from "react";
export const QuoteCreate = ({ wallet }: any) => {
  const [q, setQ] = useState("");
  return (
    <Flex
      maxW="md"
      mx="auto"
      bg="black"
      shadow="lg"
      rounded="xl"
      overflow="hidden"
      px="4"
      py="2"
      borderWidth={1}
      borderColor="hsla(0,0%,83%,.2)"
      alignItems={"center"}
      mt="6"
    >
      <Flex flexDir="column" align="flex-end">
        <Flex justify="center" align="center">
          <Avatar
            size={40}
            name={wallet}
            variant="sunset"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />
          <Box
            w="full"
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

            <Input value={q} onChange={(e) => setQ(e.target.value)} w="full" />
          </Box>
        </Flex>
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
        <Button>Submit</Button>
      </Flex>
    </Flex>
  );
};
