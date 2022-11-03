import {
  Box,
  Button,
  Text,
  Fade,
  Heading,
  Image,
  Flex,
  useDisclosure,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  Skeleton,
  useClipboard,
  Link,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Avatar from "boring-avatars";
import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  useWalletKit,
  useConnectedWallet,
  useSolana,
} from "@gokiprotocol/walletkit";
import { useEffect, useState } from "react";
import { Quote } from "../components/Quote";
import { QuoteCreate } from "../components/QuoteCreate";
import axios from "axios";
import { motion } from "framer-motion";
import { FiCopy } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import { AiFillGithub } from "react-icons/ai";
declare const window: any;
const Home: NextPage = () => {
  const { connect } = useWalletKit();
  interface Quote {
    address: string;
    quote: string;
  }
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [update, setUpdate] = useState(false);
  const [connectedtext, setConnectedtext] = useState("Connect Wallet");
  const wallet = useConnectedWallet();
  const { connected, disconnect } = useSolana();
  const { hasCopied, onCopy } = useClipboard("npm install sqlana-store");
  async function disconnectSolana() {
    if (window !== undefined) {
      await window.solana.disconnect();
      disconnect();
    }
  }
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    async function getAllQuotes() {
      const { data } = await axios.get("/api/quote/getAll");
      setQuotes(Object.values(data.collection));
    }
    getAllQuotes();
  }, [update]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignContent={"center"}
      alignItems={"center"}
      overflowY={"scroll"}
      style={{ WebkitOverflowScrolling: "unset" }}
    >
      <Button
        position={"absolute"}
        right={0}
        top={0}
        style={{
          margin: "1rem",

          backgroundColor: "white",

          textAlign: "center",
        }}
        color={
          connected
            ? connectedtext === "Disconnect"
              ? "red.500"
              : "black"
            : "black"
        }
        px="2rem"
        maxWidth={"11rem"}
        maxHeight={"2.5rem"}
        borderRadius={"0.7rem"}
        onMouseOver={() => {
          connected && setConnectedtext("Disconnect");
        }}
        onMouseLeave={() => {
          setConnectedtext("Connect Wallet");
        }}
        onClick={connected ? disconnectSolana : connect}
        leftIcon={
          connected ? (
            <Fade in={connected}>
              {" "}
              {connected && connectedtext === "Disconnect" ? (
                <SmallCloseIcon />
              ) : (
                <Avatar
                  size={28}
                  name={wallet?.publicKey?.toBase58() || ""}
                  variant="sunset"
                  colors={[
                    "#92A1C6",
                    "#146A7C",
                    "#F0AB3D",
                    "#C271B4",
                    "#C20D90",
                  ]}
                />
              )}
            </Fade>
          ) : (
            <Image src="phantom.svg" alt="phantom" />
          )
        }
      >
        {wallet?.connected ? (
          <Fade in={wallet?.connected}>
            {connectedtext === "Disconnect"
              ? "Disconnect"
              : minifyWallet(wallet.publicKey.toBase58())}
          </Fade>
        ) : (
          <Fade in={!wallet?.connected}>{connectedtext}</Fade>
        )}
      </Button>{" "}
      <Heading
        textAlign={"center"}
        color="white"
        letterSpacing="-0.05em"
        fontSize="4rem"
        fontWeight="700"
        marginTop="3rem"
      >
        Sqlana Store
      </Heading>
      <Text
        style={{
          lineHeight: "1.6rem",
          fontWeight: "400",
          letterSpacing: "-0.02em",
        }}
        color="GrayText"
        // backgroundColor="white"
        textAlign="center"
        // maxW={"10rem"}
        whiteSpace="pre-line"
        fontSize="0.9rem"
      >
        {`A NoSQL database built on Gensys-go's Shadow Drive.
        IPFS is not permanant, arweave is expensive and immutable, solana accounts are limited on space
        and not dynamically typed. 
        Store is dynamic like mongoDB, cheap as heck(1GB~$0.80) and immutable by choice.`}
      </Text>
      <Flex
        color="white"
        fontFamily="monospace"
        justify="flex-end"
        align="center"
        gap="1rem"
      >
        <motion.div
          transition={{
            ease: "easeInOut",
            duration: 2,
            delay: 0.5,
          }}
          initial={{ opacity: 0, y: 90 }}
          animate={{
            opacity: [0, 0.5, 1],
            y: [90, 0, 0],
          }}
        >
          <Button
            marginTop="5"
            // marginLeft={["5%", "5", "5", "5"]}
            marginBottom="5"
            // marginRight={["80", "80", "80", "80"]}
            variant="ghost"
            _hover={{}}
            _active={{}}
            _focus={{}}
            leftIcon={
              !hasCopied ? (
                <FiCopy size="20" onClick={onCopy} />
              ) : (
                <TiTick size="20" color="green" />
              )
            }
            border="2px solid white"
            borderRadius="xl"
            padding="4"
          >
            <Text fontSize="sm" letterSpacing="widest">
              npm i sqlana-store
            </Text>
          </Button>
        </motion.div>
        <Link href="https://github.com/anoushk1234/sqlana-store">
          <AiFillGithub size="2rem" color="white" />
        </Link>
      </Flex>
      <Text
        style={{
          lineHeight: "1.6rem",
          fontWeight: "400",
          letterSpacing: "-0.02em",
        }}
        color="GrayText"
        textAlign="center"
        fontSize="1rem"
      >
        Try the demo!
      </Text>
      <Box
        w="40%"
        h="20rem"
        maxH={"20rem"}
        borderWidth={1}
        marginTop="2rem"
        borderRadius={"0.5rem"}
        borderColor="hsla(0,0%,83%,.2)"
        background="black"
        overflowY={"scroll"}
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "unset",
        }}
        _before={{
          content: '""',
          height: "20rem",
          width: "40%",
          background: "linear-gradient(90deg, #108dc7, #ef8e38)",
          zIndex: -1,
          position: "absolute",
          filter: "blur(20px)",
        }}
      >
        <Skeleton isLoaded={quotes.length > 0}>
          {quotes &&
            quotes.map((q, index) => (
              <Quote key={index} address={q.address} quote={q.quote} />
            ))}
        </Skeleton>
      </Box>
      <Flex justifyContent="center" mt="1rem">
        <Button w="fit-content" onClick={onOpen}>
          New Quote
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor={"black"}>
          <ModalBody p="4">
            {connected ? (
              <QuoteCreate
                onClose={onClose}
                update={update}
                setUpdate={setUpdate}
                address={wallet?.publicKey?.toBase58()}
              />
            ) : (
              <Text color="white">Connect your wallet to create a quote</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Flex
        marginTop="1rem"
        justify={"center"}
        align={"center"}
        marginY="1rem"
      ></Flex>
    </Box>
  );
};

export default Home;

function minifyWallet(s: string) {
  return s.substring(0, 4) + "..." + s.substring(s.length - 4, s.length);
}
