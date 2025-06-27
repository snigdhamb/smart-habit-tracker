
"use client"

import { Avatar, Menu, Portal, Flex, Container, Stack, Center, LinkOverlay, LinkBox, defineStyle } from "@chakra-ui/react"
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import { SignOutButton } from "./AuthButtons";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Settings from "@/pages/Settings";
interface NavBarProps {
  username: string
//   login_streak: number
}

export const NavBar = ({ username }: NavBarProps) => {
  const navigate = useNavigate()
  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  })
  
  return (
    <>
        <Routes>
            <Route path="/settings" element={<Settings />} />
        </Routes>
        <Container colorPalette={"blue.100"} >
            <Flex gap="4" justify="flex-end">
                <Stack direction={"row"} h="13">
                    <Center>
                        <Link to={'/about'}>About</Link>
                    </Center>
                    <Center>
                        <Link to={'/contact'}>Contact</Link>
                    </Center>
                    <Center>
                        <Menu.Root navigate={({ value }) => navigate(`/${value}`)} positioning={{ placement: "bottom-end" }}>
                            <Menu.Trigger rounded="full" focusRing="outside">
                                <Avatar.Root css={ringCss} colorPalette={"blue"} size="lg">
                                <Avatar.Fallback name={username} />
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
