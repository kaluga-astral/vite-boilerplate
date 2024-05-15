import { NotFoundScreen, ReadingBookScreen } from '@example/screens';
import { useRouterParams } from '@example/shared';
import { ReadingBookRouteGuard } from '@example/modules/permissions';

const ReadingBookPage = () => {
  const { id } = useRouterParams();

  if (!id) {
    return <NotFoundScreen title="Книга не найдена" />;
  }

  return (
    <ReadingBookRouteGuard id={id}>
      <ReadingBookScreen id={id} />
    </ReadingBookRouteGuard>
  );
};

export default ReadingBookPage;
