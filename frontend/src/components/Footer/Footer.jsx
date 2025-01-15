import {
    Box,
    Container,
    Grid,
    Heading,
    Text,
    Link,
    List,
    ListItem,
    Icon,
    VStack,
    Stack,
} from "@chakra-ui/react";
import {
    FaMapMarker,
    FaPhone,
    FaEnvelope,
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaTwitter,
    FaYoutube,
} from "react-icons/fa";

const Footer = () => {
    return (
        <Box as="footer">
            <Grid
                templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
                minH="60vh"
            >
                {/* Footer Content */}
                <Box
                    display="flex"
                    bg="blackAlpha.900"
                    color="whiteAlpha.800"
                    pl={32}
                >
                    <VStack align="stretch" p={15} spacing={8} my="auto">
                        {/* Heading */}
                        <Box
                            position="relative"
                            pb={8}
                            _after={{
                                content: '""',
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "70px",
                                height: "2px",
                                backgroundColor: "blue.500",
                            }}
                        >
                            <Heading
                                as="h2"
                                size="2xl"
                                color="white"
                                textTransform="uppercase"
                                fontWeight={600}
                            >
                                Get in touch
                            </Heading>
                        </Box>

                        {/* Description */}
                        <Text fontSize="xl" fontWeight={400}>
                            Feel free to contact us at any time. We are here to
                            help.
                        </Text>

                        {/* Contact Information */}
                        <List
                            spacing={3}
                            textTransform="uppercase"
                            fontSize="lg"
                        >
                            <ListItem display="flex" alignItems="center">
                                <Icon
                                    as={FaMapMarker}
                                    color="blue.500"
                                    mr={3}
                                />
                                <Text>
                                    Address:{" "}
                                    <Text as="span" color="white">
                                        Libali - 8, Bhaktapur, Nepal
                                    </Text>
                                </Text>
                            </ListItem>

                            <ListItem display="flex" alignItems="center">
                                <Icon as={FaPhone} color="blue.500" mr={3} />
                                <Text>
                                    Phone Number:{" "}
                                    <Text as="span" color="white">
                                        16614119
                                    </Text>
                                </Text>
                            </ListItem>

                            <ListItem display="flex" alignItems="center">
                                <Icon as={FaEnvelope} color="blue.500" mr={3} />
                                <Text>
                                    Email:{" "}
                                    <Link
                                        color="white"
                                        href="mailto:asymptoads@gmail.com"
                                    >
                                        asymptoads@gmail.com
                                    </Link>
                                </Text>
                            </ListItem>
                            <ListItem>
                                <Stack
                                    direction="row"
                                    spacing={8}
                                    justify="left"
                                    p={6}
                                >
                                    <Link
                                        href="https://facebook.com"
                                        isExternal
                                    >
                                        <Icon
                                            as={FaFacebook}
                                            boxSize={8}
                                            color="white"
                                        />
                                    </Link>

                                    <Link
                                        href="https://instagram.com"
                                        isExternal
                                    >
                                        <Icon
                                            as={FaInstagram}
                                            boxSize={8}
                                            color="white"
                                        />
                                    </Link>

                                    <Link
                                        href="https://linkedin.com"
                                        isExternal
                                    >
                                        <Icon
                                            as={FaLinkedin}
                                            boxSize={8}
                                            color="white"
                                        />
                                    </Link>

                                    <Link href="https://twitter.com" isExternal>
                                        <Icon
                                            as={FaTwitter}
                                            boxSize={8}
                                            color="white"
                                        />
                                    </Link>

                                    <Link href="https://youtube.com" isExternal>
                                        <Icon
                                            as={FaYoutube}
                                            boxSize={8}
                                            color="white"
                                        />
                                    </Link>
                                </Stack>
                            </ListItem>
                        </List>
                    </VStack>
                </Box>
                {/* <Box bg="gray.50" py={10}>
                    <Container maxW="container.md" textAlign="center">
                        <Heading as="h3" size="lg" mb={4}>
                            Visit Us
                        </Heading>
                        <Text mb={6}>
                            Come and play at our futsal courts! Find us at the
                            location below:
                        </Text> */}{" "}
                <Box
                    borderRadius="md"
                    // maxWidth="100%"
                    // hidden="auto"
                    overflow="hidden"
                    boxShadow="lg"
                >
                    <iframe
                        title="Futsala Location"
                        src="https:www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4348.959063687109!2d85.43905952513944!3d27.669058953671406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb0553ad61415f%3A0xfe439c68883bde6e!2sKhwopa%20Futsal%20Pvt.%20Ltd%2C%20Bhaktapur%2044800!5e1!3m2!1sen!2snp!4v1736952837282!5m2!1sen!2snp"
                        // height="600"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </Box>
                {/* </Container>
                </Box> */}
            </Grid>
        </Box>
    );
};

export default Footer;
