export interface ModalDataType {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  location: string;
  iconUrl: string;
}

export interface ModalEventType {
  isModalVisible: boolean;
  type: string;
  handleCancel: () => void;
  handleOk: () => void;
  remove: Function;
  modalData: ModalDataType;
  onFinish: (values: ModalDataType) => void;
}
