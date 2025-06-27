import { Flex, Center, Box, Em, Image, Card, Heading } from '@chakra-ui/react';
import Logo from '../assets/Logo.png';
import { keyframes } from '@emotion/react';
import { SignInButton } from '../components/AuthButtons';

const SignIn: React.FC = () => {
  const slideIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      minW="100vw"
      px={4} // responsive horizontal padding
      // bg="teal.500"
    >
      <Flex direction={['column', 'column', 'row']} w="100%" h="100%">
        <Box flex="1" p={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Center mb={10}>
            <Box alignSelf="flex-start" animation={`${slideIn} 1.2s ease-out`}  opacity={0} animationFillMode="forwards">
              <Image src={Logo} alt="App Logo" boxSize="300px" objectFit="contain" />
            </Box>
          </Center>
          <Center mb={10}>
            <Box animation={`${slideIn} 1.2s ease-out`}  animationDelay="0.2s" opacity={0} animationFillMode="forwards">
              <Em>Big goals start with small steps. Track yours daily.</Em>
            </Box>
          </Center>
          <Center>
            <Box animation={`${fadeIn} 0.5s ease-out`} animationDelay="2.1s" opacity={0} animationFillMode="forwards">
              <SignInButton />
            </Box>
          </Center>
        </Box>
        <Box width="1px" bg="gray.200" mx={2} />
        <Box flex="1" p={6} display="flex" flexDirection="column" justifyContent="center" alignItems="left">
          <Card.Root size="sm" w="80%" mb={5} boxShadow="md" animation={`${slideIn} 1s ease-out`} opacity={0} animationFillMode="forwards" animationDelay="0.6s">
            <Card.Header>
              <Heading size="md">Set your habits—or let AI do it for you.</Heading>
            </Card.Header>
            <Card.Body color="fg.muted">
              Not sure where to start? Our AI recommends daily habits based on your goals and lifestyle.
            </Card.Body>
          </Card.Root>
          <Card.Root size="sm" w="80%" mb={5} boxShadow="md" animation={`${slideIn} 1s ease-out`} opacity={0} animationFillMode="forwards" animationDelay="1.1s">
            <Card.Header>
              <Heading size="md">Stay on track.</Heading>
            </Card.Header>
            <Card.Body color="fg.muted">
              Get smart reminders, build streaks, and show up for your future self
            </Card.Body>
          </Card.Root>
          <Card.Root size="sm" w="80%" mb={5} boxShadow="md" animation={`${slideIn} 1s ease-out`} opacity={0} animationFillMode="forwards" animationDelay="1.6s">
            <Card.Header>
              <Heading size="md">Make success feel automatic.</Heading>
            </Card.Header>
            <Card.Body color="fg.muted">
              Let daily discipline do the work—then watch momentum take over
            </Card.Body>
          </Card.Root>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SignIn;