import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import type { DataGridPaginationProps, DataGridSort } from '@example/shared';
import {
  ActionCell,
  AddOutlineMd,
  DataGrid,
  DataGridPagination,
  Tooltip,
} from '@example/shared';

import { AddToCartButton, PayAccountModal } from '../../external';

import type { AvailableSortField, ListItem } from './UIStore';
import { createUIStore } from './UIStore';

export const BookList = observer(() => {
  const [
    {
      list,
      isLoading,
      totalCount,
      setSort,
      setPaginationPage,
      addToShelf,
      checkBuyPermission,
      pagination,
      sort,
      isOpenAccountPayment,
      closePaymentAccount,
    },
  ] = useState(createUIStore);

  const handleSort = (newSort?: DataGridSort<AvailableSortField>) => {
    if (newSort) {
      setSort({ sortOrder: newSort.sort, sortField: newSort.fieldId });
    }
  };

  const handleChangePage: DataGridPaginationProps['onChange'] = (
    _,
    newPage,
  ) => {
    setPaginationPage(newPage);
  };

  return (
    <>
      <DataGrid<ListItem, AvailableSortField>
        columns={[
          { field: 'name', label: 'Название', sortable: true },
          { field: 'price', label: 'Цена', sortable: true },
          {
            sortable: false,
            align: 'center',
            width: '10%',
            renderCell: ({ store, acceptableAge }) => {
              const { isAllow, reason } = checkBuyPermission(acceptableAge);

              if (isAllow) {
                return <AddToCartButton store={store} />;
              }

              return (
                <Tooltip title={reason} withoutContainer={false}>
                  <AddToCartButton isDisabled store={store} />
                </Tooltip>
              );
            },
          },
          {
            sortable: false,
            align: 'center',
            renderCell: (row) => {
              return (
                <ActionCell
                  row={row}
                  actions={{
                    main: [
                      {
                        icon: <AddOutlineMd />,
                        name: 'Добавить на полку',
                        onClick: () => addToShelf(row.id),
                      },
                    ],
                  }}
                />
              );
            },
          },
        ]}
        rows={list}
        keyId="id"
        loading={isLoading}
        sorting={sort && { sort: sort.sortOrder, fieldId: sort.sortField }}
        onSort={handleSort}
        Footer={
          <DataGridPagination
            onChange={handleChangePage}
            page={pagination.page}
            totalCount={totalCount}
          />
        }
      />
      <PayAccountModal
        isOpen={isOpenAccountPayment}
        onClose={closePaymentAccount}
      />
    </>
  );
});
