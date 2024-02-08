import {Group, Stack, Text, Title} from "@mantine/core";

type Step = {
  step: number,
  text: string,
};

const HowToUse = () => {
  const steps: Array<Step> = [
    {
      step: 1,
      text: 'Upload an image of your receipt (JPEG and PNG only), or take a photo using the webcam option.'
    },
    {
      step: 2,
      text: 'Wait for the image to be analyzed. Once analyzed, gray boxes will appear over expense-like numbers that can be painted.'
    },
    {
      step: 3,
      text: 'Select appropriate category brushes and click on expenses to paint them as those categories.'
    },
    {
      step: 4,
      text: 'The Summary section keeps a running total of all categories. You can also adjust tax settings here.'
    },
    {
      step: 5,
      text: 'Once you have painted all the expenses you want, click Copy as CSV Text to copy the summary into your clipboard.'
    },
  ];

  return (
    <Stack
      gap="xs"
    >
      <Title>How To Use</Title>
      {steps.map((a: Step) =>
        <Group
          align="flex-start"
          wrap="no-wrap"
        >
          <Text>{a.step}.</Text>
          <Text>{a.text}</Text>
        </Group>
      )}
    </Stack>
  );
}

export default HowToUse;