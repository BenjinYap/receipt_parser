import {Divider, List, Stack, Text, Title} from "@mantine/core";

type Change = {
  version: string,
  date: string,
  items: Array<string>,
};

const Changelog = () => {
  const changes: Array<Change> = [
    {
      version: '1.0.1',
      date: '2024-03-14',
      items: [
        'Added a changelog.',
        'Added missing brush colors to summary table.',
      ],
    },
  ];

  return (
    <Stack gap="xs">
      <Title>Changelog</Title>
      <Divider/>
      {changes.map((o: Change) => (
        <Stack
          key={o.version}
          gap="xs"
        >
          <Title order={2}>{o.version}</Title>
          <Text>{o.date}</Text>
          <List>
            {o.items.map((a: string) => (
              <List.Item key={a}>{a}</List.Item>
            ))}
          </List>
          <Divider/>
        </Stack>
      ))}
    </Stack>
  );
}

export default Changelog;