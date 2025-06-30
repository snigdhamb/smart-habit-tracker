import Logo from '../assets/Logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Stack, Image, ChakraProvider } from '@chakra-ui/react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="min-w-[200px] bg-[#2ab9a3] text-white p-8 flex flex-col items-center justify-between rounded-r-3xl">
          <div>
            <nav className="space-y-5 flex flex-col items-center">
              <Stack>
                <div className="flex justify-center">
                  <Image src={Logo} alt="App Logo" boxSize="150px" objectFit="contain" mt={10} mb={5}/>
                </div>

                <Button
                  onClick={() => navigate("/")}
                  bg={location.pathname === "/" ? "midnightGreen" : "transparent"}
                  color="white"
                  variant="solid"
                  w={"180px"}
                >
                  <span>Home</span>
                </Button>

                <Button
                  onClick={() => navigate("/dashboard")}
                  bg={location.pathname === "/dashboard" ? "midnightGreen" : "transparent"}
                  color="white"
                  variant="solid"
                  w={"180px"}
                >
                  <span>Progress</span>
                </Button>

                <Button
                  onClick={() => navigate("/habits")}
                  bg={location.pathname === "/habits" ? "midnightGreen" : "transparent"}
                  color="white"
                  variant="solid"
                  w={"180px"}
                >
                  <span>Habits</span>
                </Button>

                <Button
                  onClick={() => navigate("/settings")}
                  bg={location.pathname === "/settings" ? "midnightGreen" : "transparent"}
                  color="white"
                  variant="solid"
                  w={"180px"}
                >
                  <span>Settings</span>
                </Button>
              </Stack>
            </nav>
          </div>
      </aside>
  );
};

export default Sidebar;