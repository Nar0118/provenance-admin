import { useContext, useEffect, useMemo, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { DatePicker, Upload } from 'antd/lib';
import { UploadFile } from 'antd/lib/upload/interface';
import { Form } from 'antd';
import Modal from 'components/shared/modal';
import Input from 'components/shared/input';
import Button from 'components/shared/button';
import Image from 'components/shared/image';
import notification from 'components/shared/notification';
import { ButtonType } from 'components/shared/button/type';
import PageTable from 'components/shared/pageTable';
import { handelCancel, dateFormatter } from 'utils/helpers';
import { EventData } from 'utils/model/event';
import { isDisabled } from 'utils/constants/eventValidation';
import { ModalType } from 'utils/constants/enums';
import { validator } from 'utils/constants/validation';
import { beforeUpload, handlePictureUpload } from 'utils/services/files';
import { EventServiceContext } from 'utils/services/service/eventService';

import styles from './event.module.scss';

export default function Event(): JSX.Element {
  const eventService = useContext(EventServiceContext);

  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();

  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData>();
  const [defaultEvent, setDefaultEvent] = useState<EventData>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countOfPage, setCountOfPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [eventIcon, setEventIcon] = useState<FormData>();
  const [logoUrl, setLogoUrl] = useState<string>();
  const [warningModalVisible, setWarningModalVisible] = useState<boolean>(
    false
  );
  const [
    defaultCreateFormValue,
    setDefaultCreateFormValue,
  ] = useState<EventData>();
  const [firstRefresh, setFirstRefresh] = useState<boolean>(true);
  const [modalType, setModalType] = useState<ModalType>();

  const getAllEvents = async (): Promise<void> => {
    const res = await eventService.getAllEvents(
      limit,
      limit * (currentPage - 1)
    );

    const updatedEvents = res?.data?.map(
      (item: EventData): EventData => {
        const dateCreated = new Date(item.createdAt);
        const dateStart = new Date(item.startDate);
        const dateEnd = new Date(item.endDate);

        return {
          ...item,
          createdAt: dateFormatter(dateCreated),
          startDate: dateFormatter(dateStart),
          endDate: dateFormatter(dateEnd),
        };
      }
    );

    if (Array.isArray(updatedEvents)) {
      setCountOfPage(Math.ceil(res.count / limit) * 10);
      setEvents(updatedEvents);
      setFirstRefresh(false);
    }
  };

  const setWarningModalVisibility = (): void => {
    setWarningModalVisible(!warningModalVisible);
  };

  const handleFormCancel = (value: boolean): void => {
    !value;
    value
      ? handelCancel(
          defaultCreateFormValue,
          createForm.getFieldsValue(),
          setCreateModalVisibility,
          setWarningModalVisibility
        )
      : handelCancel(
          defaultEvent,
          selectedEvent,
          setUpdateModalVisibility,
          setWarningModalVisibility
        );
  };

  const handleEdit = (event: EventData): void => {
    setDefaultEvent(
      JSON.parse(
        JSON.stringify({
          _id: event._id,
          title: event.title ?? '',
        })
      )
    );

    setSelectedEvent(
      JSON.parse(
        JSON.stringify({
          _id: event._id,
          title: event.title,
          iconUrl: event.iconUrl,
          location: event.location,
        })
      )
    );

    setUpdateModalVisibility();
  };

  useEffect(() => {
    getAllEvents();
  }, [currentPage, limit]);

  useEffect(() => {
    editForm.resetFields();
  }, [modalVisible]);

  const columns = [
    {
      title: 'Edit/Delete',
      key: 'changeEvent',
      tooltip: true,
      render: (event: EventData) => (
        <div className={styles.buttonsContainer}>
          <p onClick={() => handleEdit(event)}>EDIT</p>
          <p onClick={() => handleDeleteEvent(event?._id)}>REMOVE</p>
        </div>
      ),
    },
    {
      title: 'Icon',
      dataIndex: 'iconUrl',
      key: 'icon',
      tooltip: true,
      ellipsis: true,
      render: (event: EventData) => (
        <div>
          <Image
            loader={() => `${event}`}
            src={`${event}` ?? ''}
            width={50}
            height={50}
          />
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      tooltip: true,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
  ];

  const setUpdateModalVisibility = (): void => {
    setModalType(ModalType.EDIT);
    setModalVisible(!modalVisible);
  };

  const setCreateModalVisibility = (): void => {
    setModalType(ModalType.CREATE);
    setModalVisible(!modalVisible);
    if (!modalVisible) {
      const myTimeout = setTimeout(() => {
        setDefaultCreateFormValue(createForm.getFieldsValue());
        clearTimeout(myTimeout);
      }, 100);
    }
  };

  const handleEditEvent = async (values: EventData): Promise<void> => {
    let iconUrl: string;

    if (eventIcon) {
      iconUrl = await eventService.uploadIcon(eventIcon);
    }

    const updatedEvent = await eventService.updateEvent({
      ...values,
      _id: selectedEvent._id,
      iconUrl: iconUrl ?? selectedEvent?.iconUrl,
    });

    if (updatedEvent?.success) {
      notification({
        messageType: 'success',
        message: 'Success',
        description: 'Event successfully updated',
      });
      const foundEvent = events.find(
        (event: EventData) => event._id === updatedEvent.data._id
      );
      const foundEventIndex = events.indexOf(foundEvent);
      const newArray = [...events];
      newArray[foundEventIndex] = updatedEvent.data;
      setEvents(newArray);
    } else {
      notification({
        messageType: 'error',
        message: 'Oops!',
        description: 'Something went wrong, please try again.',
      });
    }
    setSelectedEvent(null);
    setUpdateModalVisibility();
  };

  const handleCreateEvent = async (values: EventData): Promise<void> => {
    const iconUrl = await eventService.uploadIcon(eventIcon);

    const createdEvent = {
      ...values,
      iconUrl: iconUrl,
    };

    const registerEvent = await eventService.registerEvent(createdEvent);

    if (registerEvent?.success) {
      getAllEvents();
    } else {
      notification({
        messageType: 'error',
        message: 'Error',
        description: registerEvent?.error,
      });
    }
    setLogoUrl('');
    createForm.resetFields();
    setCreateModalVisibility();
  };

  const handleDeleteEvent = async (id: string) => {
    const isDeleted = await eventService.deleteEvent(id);
    if (isDeleted?.success) {
      notification({
        messageType: 'success',
        message: 'Success',
        description: 'Event successfully deleted',
      });
      const arr = [...events];
      const index = arr.indexOf(arr.find((item: EventData) => item._id === id));
      arr.splice(index, 1);
      setEvents(arr);
    } else {
      notification({
        messageType: 'error',
        message: 'Oops!',
        description: 'Something went wrong, please try again.',
      });
    }
  };

  const handleUploadChange = (file: UploadFile<Blob>): void => {
    const url = URL.createObjectURL(file.originFileObj);
    const eventData = { ...selectedEvent };
    setSelectedEvent({
      ...eventData,
      iconUrl: url ?? selectedEvent?.iconUrl,
    });
    setLogoUrl(url);
  };

  const disableButton = useMemo((): boolean => {
    return JSON.stringify(defaultEvent) === JSON.stringify(selectedEvent);
  }, [selectedEvent]);

  console.log(selectedEvent,"selectedEvent");
  

  return (
    <div className={styles.container}>
      <PageTable
        headerText="Events"
        dataSource={events}
        creatingItem={'Event'}
        columns={columns}
        limit={limit}
        setLimit={setLimit}
        setCreateModalVisibility={setCreateModalVisibility}
        countOfPage={countOfPage}
        setCurrentPage={setCurrentPage}
      />

      <Modal
        title={modalType === ModalType.EDIT ? 'Edit Event' : 'Create Event'}
        bodyStyle={{ overflow: 'auto' }}
        isModalVisible={modalVisible}
        onCancel={() => setModalVisible(false)}
      >
        {modalType === ModalType.EDIT && (
          <Form
            form={editForm}
            initialValues={{
              title: selectedEvent?.title,
              iconUrl: selectedEvent?.iconUrl,
              location: selectedEvent?.location,
            }}
            onFinish={handleEditEvent}
          >
            <div className={styles.inputsContainer}>
              <Form.Item
                name="iconUrl"
                valuePropName="uploadAvatar"
                className={styles.formItem}
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
                    <div className={styles.logoContainer}>
                      <div className={styles.downloadIcon}>
                        <DownloadOutlined />
                      </div>
                      <Image
                        width={100}
                        height={100}
                        src={logoUrl}
                        loader={() => logoUrl ?? ''}
                        className={styles.logoImg}
                      />
                    </div>
                  ) : (
                    <div className={styles.logoContainer}>
                      <div className={styles.downloadIcon}>
                        <DownloadOutlined />
                      </div>
                      <Image
                        width={100}
                        height={100}
                        src={selectedEvent?.iconUrl ?? ''}
                        loader={() => selectedEvent?.iconUrl}
                        className={styles.logoImg}
                      />
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Form.Item
                name="title"
                label="Title"
                className={styles.formItem}
                rules={[
                  { required: true, message: 'Please input Event title' },
                  {
                    validator: (_, value) => validator(_, value),
                  },
                ]}
              >
                <Input type="name" placeholder="Title" />
              </Form.Item>
              <Form.Item
                label="Start date"
                name="startDate"
                rules={[{ required: true, message: 'Please input Date' }]}
              >
                <DatePicker
                  getPopupContainer={(trigger) => trigger.parentElement}
                  allowClear={false}
                  className={styles.auctionStart}
                  onChange={(e) => {
                    setSelectedEvent({
                      ...selectedEvent,
                      startDate: e ? new Date(e.format()) : null,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="End date"
                name="endDate"
                rules={[{ required: true, message: 'Please input Date' }]}
              >
                <DatePicker
                  getPopupContainer={(trigger) => trigger.parentElement}
                  allowClear={false}
                  className={styles.auctionStart}
                  onChange={(e) => {
                    setSelectedEvent({
                      ...selectedEvent,
                      endDate: e ? new Date(e.format()) : null,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                name="location"
                label="Location"
                className={styles.formItem}
                rules={[
                  { required: true, message: 'Please input Location title' },
                  {
                    validator: (_, value) => validator(_, value),
                  },
                ]}
              >
                <Input type="name" placeholder="Location" />
              </Form.Item>
            </div>
            <Form.Item>
              <div className={styles.modalButtonsContainer}>
                <Button
                  className={styles.modalButtons}
                  text="Edit Event"
                  htmlType="submit"
                  disabled={disableButton}
                  btnType={ButtonType.black}
                />
                <Button
                  className={styles.modalButtons}
                  onClick={() => handleFormCancel(false)}
                  text="Cancel"
                  btnType={ButtonType.black}
                />
              </div>
            </Form.Item>
          </Form>
        )}
        {modalType === ModalType.CREATE && (
          <Form
            form={createForm}
            initialValues={{ remember: true }}
            onFinish={handleCreateEvent}
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
                    ></Image>
                  ) : (
                    <div> Upload Event Logo </div>
                  )}
                </Upload>
              </Form.Item>
              <Form.Item
                name="title"
                label="Title"
                className={styles.formItem}
                rules={[
                  { required: true, message: 'Please input Event title' },
                  {
                    validator: (_, value) => validator(_, value),
                  },
                ]}
              >
                <Input type="name" placeholder="Title" />
              </Form.Item>
              <Form.Item
                label="Start date"
                name="startDate"
                rules={[{ required: true, message: 'Please input Date' }]}
              >
                <DatePicker
                  getPopupContainer={(trigger) => trigger.parentElement}
                  allowClear={false}
                  className={styles.auctionStart}
                  onChange={(e) => {
                    setSelectedEvent({
                      ...selectedEvent,
                      startDate: e ? new Date(e.format()) : null,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="End date"
                name="endDate"
                rules={[{ required: true, message: 'Please input Date' }]}
              >
                <DatePicker
                  getPopupContainer={(trigger) => trigger.parentElement}
                  allowClear={false}
                  className={styles.auctionStart}
                  onChange={(e) => {
                    setSelectedEvent({
                      ...selectedEvent,
                      endDate: e ? new Date(e.format()) : null,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                name="location"
                label="Location"
                className={styles.formItem}
                rules={[
                  { required: true, message: 'Please input Location title' },
                  {
                    validator: (_, value) => validator(_, value),
                  },
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
                    btnType={ButtonType.black}
                    disabled={isDisabled(createForm)}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  text="Cancel"
                  onClick={() => handleFormCancel(true)}
                  className={styles.rightButton}
                  btnType={ButtonType.white}
                />
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}
