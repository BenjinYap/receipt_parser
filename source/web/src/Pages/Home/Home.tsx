import Receiptmajigger from "./Components/Receiptmajigger/Receiptmajigger";
import {Stack} from "@mantine/core";
import Changelog from "./Components/Changelog";

const Home = () => {
  return (
    <Stack
      gap="xs"
    >
      <Receiptmajigger/>
      <Changelog/>
    </Stack>
  );
};

export default Home;