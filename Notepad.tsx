<Tabs.Root navigate={({ value, node }) => navigate(`/${value}`)} variant={"plain"}fitted>
                        <Tabs.List>
                            {/* <Tabs.Trigger value="about" asChild> */}
                                <Link to={'/about'}>About</Link>
                                {/* <Link unstyled href="#about">About</Link> */}
                                {/* About */}
                            {/* </Tabs.Trigger> */}
                            <Tabs.Trigger value="contact" asChild>
                                <Link to={'/contact'}>Contact</Link>
                                {/* <Link unstyled href="#contact">Contact</Link> */}
                            </Tabs.Trigger>
                            <Menu.Root navigate={({ value, node }) => navigate(`/${value}`)} positioning={{ placement: "bottom-end" }}>
                                <Menu.Trigger rounded="full" focusRing="outside">
                                    <Avatar.Root size="sm">
                                    <Avatar.Fallback name={username} />
                                    </Avatar.Root>
                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                    <Menu.Content>
                                        <Menu.Item value="settings"><Link to={'/settings'}>Settings</Link></Menu.Item>
                                        <Menu.Item value="signout"><SignOutButton /></Menu.Item>
                                    </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>
                        </Tabs.List>
                    </Tabs.Root>