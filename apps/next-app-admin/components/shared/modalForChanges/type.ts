export interface formType {
  type?: string;
  name?: string;
  field_name?: string;
  label?: string;
}

export interface ModalForChangesProps {
  submitButtonText: string;
  modalData: any;
  formFields: formType[];
  isModalVisible: boolean;
  handleCancel: () => void;
  onFinish: (event) => void;
  setEventIcon: any;
  isEvent?: boolean;
}
