import {
    Box,
    Grid,
    Heading,
    Text,
    Link,
    List,
    ListItem,
    Icon,
    VStack,
    Stack,
    HStack,
    useBreakpointValue,
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
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box as="footer" bg="gray.900" color="gray.300" py={10}>
            <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={8}
                px={{ base: 6, md: 16 }}
            >
                {/* Contact Information Section */}
                <VStack align="start" spacing={6}>
                    <Heading
                        as="h2"
                        size="lg"
                        color="white"
                        textTransform="uppercase"
                        position="relative"
                        pb={2}
                        _after={{
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "50px",
                            height: "3px",
                            backgroundColor: "blue.400",
                        }}
                    >
                        Get in Touch
                    </Heading>
                    <Text fontSize="md">
                        Feel free to reach out to us for any queries or
                        assistance. We’re here to help!
                    </Text>
                    <List spacing={4}>
                        <ListItem>
                            <HStack spacing={3}>
                                <Icon as={FaMapMarker} color="blue.400" />
                                <Text>
                                    Libali - 8, Bhaktapur, Nepal
                                </Text>
                            </HStack>
                        </ListItem>
                        <ListItem>
                            <HStack spacing={3}>
                                <Icon as={FaPhone} color="blue.400" />
                                <Text>+977-16614119</Text>
                            </HStack>
                        </ListItem>
                        <ListItem>
                            <HStack spacing={3}>
                                <Icon as={FaEnvelope} color="blue.400" />
                                <Link href="mailto:asymptoads@gmail.com" color="blue.200">
                                    asymptoads@gmail.com
                                </Link>
                            </HStack>
                        </ListItem>
                    </List>
                    <HStack spacing={6} pt={4}>
                        <Link href="https://facebook.com" isExternal>
                            <Icon as={FaFacebook} boxSize={6} _hover={{ color: "blue.400" }} />
                        </Link>
                        <Link href="https://instagram.com" isExternal>
                            <Icon as={FaInstagram} boxSize={6} _hover={{ color: "pink.400" }} />
                        </Link>
                        <Link href="https://linkedin.com" isExternal>
                            <Icon as={FaLinkedin} boxSize={6} _hover={{ color: "blue.500" }} />
                        </Link>
                        <Link href="https://twitter.com" isExternal>
                            <Icon as={FaTwitter} boxSize={6} _hover={{ color: "cyan.400" }} />
                        </Link>
                        <Link href="https://youtube.com" isExternal>
                            <Icon as={FaYoutube} boxSize={6} _hover={{ color: "red.400" }} />
                        </Link>
                    </HStack>
                </VStack>

                {/* Map Section */}
                <Box
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="lg"
                    height={isMobile ? "300px" : "400px"}
                >
                    <iframe
                        title="Futsala Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4348.959063687109!2d85.43905952513944!3d27.669058953671406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb0553ad61415f%3A0xfe439c68883bde6e!2sKhwopa%20Futsal%20Pvt.%20Ltd%2C%20Bhaktapur%2044800!5e1!3m2!1sen!2snp!4v1736952837282!5m2!1sen!2snp"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </Box>
            </Grid>
            <Text textAlign="center" pt={10} fontSize="sm" color="gray.500">
                © {new Date().getFullYear()} AsymptoAds. All rights reserved.
            </Text>
        </Box>
    );
};

export default Footer;
