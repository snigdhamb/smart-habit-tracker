
"use client"

import { Avatar, Menu, Portal, Flex, Container, Stack, Center, LinkOverlay, LinkBox, defineStyle } from "@chakra-ui/react"
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import { SignOutButton } from "./AuthButtons";
import Settings from "@/pages/Settings";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/firebase/firebase";

export const NavBar = () => {
  const navigate = useNavigate()
  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  })
  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  return (
    <>
        <Routes>
            <Route path="/settings" element={<Settings />} />
        </Routes>
        <Container mt={2} mb={8}>
            <Flex justify="flex-end">
                <Stack direction={"row"} h="13" gap={12}>
                    <Center>
                        <Link color="teal" to={'/about'}>About</Link>
                    </Center>
                    <Center>
                        <Link to={'/contact'}>Contact</Link>
                    </Center>
                    <Center>
                        <Menu.Root navigate={({ value }) => navigate(`/${value}`)} positioning={{ placement: "bottom-end" }}>
                            <Menu.Trigger rounded="full" focusRing="outside">
                                <Avatar.Root css={ringCss} colorPalette={"teal"} size="lg">
                                <Avatar.Fallback name={user?.displayName?.split(" ")[0] || "User"} />
                                </Avatar.Root>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                <Menu.Content>
                                    <Menu.Item value="settings">
                                        <LinkBox>
                                            <LinkOverlay>
                                                <Link to={'/settings'}>Settings</Link>
                                            </LinkOverlay>
                                        </LinkBox>
                                    </Menu.Item>
                                        <Menu.Item value="signout">
                                            <SignOutButton />
                                        </Menu.Item>
                                </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </Center>
                </Stack>
            </Flex>
        </Container>
    </>
  )
}
