import {ActionIcon, AppShell, Box, Container, Group, Text} from "@mantine/core";
import {Outlet} from "react-router-dom";
import {IconReceipt, IconHelp} from "@tabler/icons-react";
import {useClickOutside, useDisclosure, useDocumentTitle} from "@mantine/hooks";
import HowToUse from "./Global/Layout/HowToUse";
import {useState} from "react";

const Layout = () => {
  useDocumentTitle('Receipt Parser');

  const [helpButton, setHelpButton] = useState(null);
  const [aside, setAside] = useState(null);
  const [asideOpen, asideOpenHandlers] = useDisclosure(false);
  useClickOutside(() => asideOpenHandlers.close(), null, [helpButton, aside]);

  return (
    <AppShell
      header={{height: 60}}
      aside={{
        width: 500,
        breakpoint: 'xs',
        collapsed: {desktop: !asideOpen, mobile: !asideOpen},
      }}
    >
      <AppShell.Header>
        <Group
          h="100%"
          px="xs"
        >
          <IconReceipt size={36}></IconReceipt>
          <Text
            size="xl"
            fw={700}
            flex="1"
          >
            Receipt Parser
          </Text>
          <ActionIcon
            ref={setHelpButton}
            variant="subtle"
            onClick={() => asideOpenHandlers.toggle()}
          >
            <IconHelp/>
          </ActionIcon>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Container
          p="xs"
        >
          <Outlet/>
        </Container>
      </AppShell.Main>
      <AppShell.Aside>
        <Box
          ref={setAside}
          p="xs"
        >
          <HowToUse/>
        </Box>
      </AppShell.Aside>
    </AppShell>
  );
};

export default Layout;