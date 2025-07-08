import Logo from '../assets/Logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Stack, Image } from '@chakra-ui/react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="min-w-[280px] bg-[#2ab9a3] text-white p-8 flex flex-col items-center justify-start rounded-r-3xl full-height ">
          <div>
            <nav className="space-y-5 flex flex-col items-center">
              <Stack gap={4}>
                <div className="flex justify-center">
                  <Image src={Logo} alt="App Logo" boxSize="180px" objectFit="contain" mt={12} mb={10}/>
                </div>

                <Button
                  onClick={() => navigate("/")}
                  bg={location.pathname === "/" ? "midnightGreen" : "transparent"}
                  color="white"
                  variant="solid"
                  w={"260px"}
                >
                  Home
                </Button>

                <Button
                  onClick={() => navigate("/dashboard")}
                  bg={location.pathname === "/dashboard" ? "midnightGreen" : "transparent"}
                  color="white"
                  variant="solid"
                  w={"260px"}
                >
                  Dashboard
                </Button>

                <Button
                  onClick={() => navigate("/habits")}
                  bg={location.pathname === "/habits" ? "midnightGreen" : "transparent"}
                  color="white"
                  variant="solid"
                  w={"260px"}
                >
                  <span>Habits</span>
                </Button>

                {/* <Button
                  onClick={() => navigate("/settings")}
                  bg={location.pathname === "/settings" ? "midnightGreen" : "transparent"}
                  color="white"
                  variant="solid"
                  w={"260px"}
                >
                  <span>Settings</span>
                </Button> */}
              </Stack>
            </nav>
          </div>
      </aside>
  );
};

export default Sidebar;