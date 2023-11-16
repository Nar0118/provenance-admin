import { useEffect, useState } from 'react';
import { Table } from 'antd';
import Button from 'components/shared/button';
import { ButtonType } from 'components/shared/button/type';
import PageTableProps from './types';

import styles from './table.module.scss';

export default function PageTable({
  headerText,
  creatingItem,
  dataSize,
  dataSource,
  countOfPage,
  limit,
  setCurrentPage,
  setCreateModalVisibility,
  setLimit,
  ...rest
}: PageTableProps): JSX.Element {
  const [pageSize, setPageSize] = useState<number[]>();
  const [pageCounter, setPageCounter] = useState<number>();

  const pageSizeCount = (): void => {
    if (countOfPage <= 10) {
      setPageSize([10]);
    } else if (countOfPage <= 20) {
      setPageSize([10, 20]);
    } else if (countOfPage <= 50) {
      setPageSize([10, 20, 50]);
    } else {
      setPageSize([10, 20, 50, 100]);
    }
  };

  useEffect(() => {
    pageSizeCount();
  }, [pageCounter]);

  return (
    <div className={styles.table}>
      {headerText && <div className={styles.title}>{headerText}</div>}
      <div className={styles.buttons}>
        {creatingItem && (
          <Button
            text={`Create ${creatingItem}`}
            onClick={setCreateModalVisibility}
            btnType={ButtonType.black}
          />
        )}
      </div>
      <div>
        <Table
          className={dataSize ? styles.miniTable : styles.tableContent}
          dataSource={dataSource}
          pagination={{
            total: countOfPage,
            showSizeChanger: countOfPage < countOfPage + 1,
            onChange(page, pageSize) {
              setLimit(pageSize);
              setPageCounter(pageSize);
            },
            pageSizeOptions: pageSize,
          }}
          onChange={(e) => setCurrentPage(e.current)}
          rowKey="_id"
          {...rest}
        />
      </div>
    </div>
  );
}
