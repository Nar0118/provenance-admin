import { TableProps } from 'antd';

export default interface PageTableProps extends TableProps<PageTableProps> {
  headerText?: string;
  creatingItem?: string;
  countOfPage?: number;
  dataSize?: boolean;
  limit?: number;
  dataSource?: Array<object>;
  setCreateModalVisibility?: () => void;
  setCurrentPage?: (e: number) => void;
  setLimit?: (e: number) => void;
}
