import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { PageLayout } from '@example/shared';
import { BookForm } from '@example/modules/administration';

import { createUIStore } from './UIStore';

export const CreateBookScreen = observer(() => {
  const [{ createBook }] = useState(createUIStore);

  return (
    <PageLayout
      header={{ title: 'Добавить книгу' }}
      content={{
        children: <BookForm onSubmit={createBook} />,
        isPaddingDisabled: false,
      }}
    />
  );
});
