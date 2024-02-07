import {AppShell, Box, Group, Text} from "@mantine/core";
import {Outlet} from "react-router-dom";
import {IconReceipt} from "@tabler/icons-react";
import {useDocumentTitle} from "@mantine/hooks";

const Layout = () => {
  useDocumentTitle('Recept Parser');

  return (
    <AppShell
      header={{height: 60}}
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
          >Receipt Parser</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Box
          p="xs"
        >
          <Outlet/>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;