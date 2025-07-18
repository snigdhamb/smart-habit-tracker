// src/pages/Onboarding.tsx
import { useNavigate } from "react-router-dom";
import { Flex, Center, Box, Em, Image, Card, Heading, Stack, Button } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import Logo from '../assets/LogoImage.png';

export default function Onboarding() {
  const navigate = useNavigate();
  const slideIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  return (
    <Flex minH="100vh" justify="center" align="center" bg="#fdfcfb">
      <Stack gap={6} p={10} bg="white" rounded="lg" shadow="md" align="center" w="full" maxW="xl" h="lg">
        <Box height={"6"} />
        <Image src={Logo} alt="App Logo" boxSize="150px" objectFit="contain" 
        animation={`${slideIn} 0.6s ease-out`} opacity={0} animationFillMode="forwards" />
        <Heading animation={`${slideIn} 0.6s ease-out`} opacity={0} animationFillMode="forwards" size="4xl" animationDelay={"0.1s"}>
          Welcome to Smart Track
        </Heading>
        <Box animation={`${slideIn} 0.6s ease-out`} animationDelay={"0.2s"} opacity={0} animationFillMode="forwards">
          <Em>Let’s help you start building habits aligned with your goals.</Em>
        </Box>
        <Box height="6" />
        <Button
          w="full"
          bgColor={"midnightGreen"}
          onClick={() => navigate("/generate-habits")}
          animation={`${slideIn} 0.6s ease-out`}
          animationDelay={"0.4s"}
          opacity={0}
          animationFillMode="forwards"
        >
          Input your goal & pick from suggestions
        </Button>
        <Button
          w="full"
          color={"midnightGreen"}
          onClick={() => navigate("/generate-habits")}
          animation={`${slideIn} 0.6s ease-out`}
          animationDelay={"0.6s"}
          opacity={0}
          animationFillMode="forwards"
        >
          Set your own habits
        </Button>
      </Stack>
    </Flex>
  );

}