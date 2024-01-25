import {AppShell, Box, Group, Title} from "@mantine/core";
import {Outlet} from "react-router-dom";
import {IconReceipt} from "@tabler/icons-react";

const Layout = () => {
  return (
    <AppShell
      header={{height: 60}}
    >
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
        >
          <IconReceipt size={36}></IconReceipt>
          <Title>Receipt Parser</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Box
          p="md"
        >
          <Outlet/>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;