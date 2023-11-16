import { useEffect, useState } from 'react';
import { DatePicker, Form, FormInstance, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import Button from '../button';
import { ButtonType } from '../button/type';
import dayjs from 'dayjs';
import Modal from '../modal';
import Image from '../image';
import { ModalForChangesProps } from './type';
import Input from '../input';

import styles from './modalForChanges.module.scss';

export const ModalForChanges = ({
  submitButtonText,
  modalData,
  formFields,
  isModalVisible,
  handleCancel,
  onFinish,
  setEventIcon,
  isEvent,
}: ModalForChangesProps) => {
  const [form] = Form.useForm<FormInstance<any>>();
  const [logoUrl, setLogoUrl] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (Object.keys(modalData).length) {
      form.setFieldsValue(modalData);
    }
    if (Object.keys(modalData).length === 0) {
      form.resetFields();
    }
  }, [form, modalData]);

  const handlePictureUpload = (file: string | Blob): FormData => {
    const data = new FormData();
    data.append('file', file);

    return data;
  };

  const handleUploadChange = (file: UploadFile<Blob>): void => {
    const url = URL.createObjectURL(file.originFileObj);
    setLogoUrl(url);
  };

  const beforeUpload = (file: any): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      setErrorMessage('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setErrorMessage('Image must smaller than 2MB!');
    }

    return isJpgOrPng && isLt2M;
  };

  return (
    <Modal
      title={submitButtonText}
      visible={isModalVisible}
      onCancel={handleCancel}
    >
      {isEvent ? (
        <Form
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <div className={styles.inputsContainer}>
            <Form.Item
              name="iconUrl"
              className={styles.formItem}
              valuePropName="uploadImg"
              rules={[{ required: true, message: 'Please add Event Logo' }]}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                action={
                  ((file) => {
                    setEventIcon(handlePictureUpload(file));
                  }) as any
                }
                beforeUpload={beforeUpload}
                onChange={({ file }) => handleUploadChange(file)}
              >
                {logoUrl ? (
                  <Image
                    width="100px"
                    height="100px"
                    src={logoUrl}
                    loader={() => logoUrl}
                  />
                ) : (
                  <div> Upload Event Logo </div>
                )}
              </Upload>
            </Form.Item>
            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}
            <Form.Item
              name="title"
              label="Name"
              className={styles.formItem}
              rules={[{ required: true, message: 'Please input Event Name' }]}
            >
              <Input type="name" placeholder="Name" />
            </Form.Item>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: 'Please input Date' }]}
            >
              <DatePicker
                getPopupContainer={(trigger) => trigger.parentElement}
                className={styles.auctionStart}
              />
            </Form.Item>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: 'Please input Date' }]}
            >
              <DatePicker
                getPopupContainer={(trigger) => trigger.parentElement}
                className={styles.auctionStart}
              />
            </Form.Item>
            <Form.Item
              name="location"
              label="Location"
              className={styles.formItem}
              rules={[
                { required: true, message: 'Please input Location Name' },
              ]}
            >
              <Input type="name" placeholder="Location" />
            </Form.Item>
          </div>
          <div className={styles.buttonSection}>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  text="Submit"
                  htmlType="submit"
                  className={styles.signUpButton}
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button text="Cancel" className={styles.rightButton} />
            </Form.Item>
          </div>
        </Form>
      ) : (
        <Form initialValues={modalData} onFinish={onFinish} form={form}>
          {formFields.map((field) => (
            <Form.Item
              name={field.name}
              className={styles.formItem}
              rules={[
                {
                  required: true,
                  message: `Please, write a ${field.label || field.name}.`,
                },
              ]}
            >
              <Input
                type={field.type}
                label={`${
                  field.field_name.charAt(0).toUpperCase() +
                  field.field_name.slice(1)
                }`}
                value={modalData[field.field_name]}
                className={styles.formInput}
              />
            </Form.Item>
          ))}
          <div className={styles.editSection}>
            <Button
              text={submitButtonText}
              htmlType="submit"
              btnType={ButtonType.black}
            />
            <Button
              text="Cancel"
              btnType={ButtonType.black}
              onClick={handleCancel}
            />
          </div>
        </Form>
      )}
    </Modal>
  );
};
