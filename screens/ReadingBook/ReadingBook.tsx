import { PageLayout, Typography } from '@example/shared';

type Props = {
  id: string;
};

export const ReadingBookScreen = ({ id }: Props) => {
  return (
    <PageLayout
      header={{ title: id }}
      content={{
        children: <Typography>Книга в онлайн</Typography>,
      }}
    />
  );
};
