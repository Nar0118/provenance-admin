import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button } from 'antd';
import Layout, { Content, Footer } from 'antd/lib/layout/layout';
import axios from 'axios';
import { ModalDataType } from './types';
import { ModalForChanges } from '../modalForChanges';
import Image from '../image';
import { EventEnum } from 'utils/constants/event';
import Modal from '../modal';
import { dateFormatter } from 'utils/constants/validation';

import 'antd/dist/antd.css';
import env from 'utils/constants/env';

const formFields = [
  {
    name: 'title',
    field_name: 'title',
    label: 'Title',
  },
  {
    name: 'startDate',
    field_name: 'startDate',
    label: 'Start Date',
  },
  {
    name: 'endDate',
    field_name: 'endDate',
    label: 'End Date',
  },
  {
    name: 'location',
    field_name: 'location',
    label: 'Location',
  },
];

export const EventTable = () => {
  const [data, setData] = useState<ModalDataType[]>([]);
  const [modalData, setModalData] = useState<ModalDataType | {}>({});
  const [type, setType] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [eventIcon, setEventIcon] = useState<FormData>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(
    false
  );

  const columns = [
    {
      dataIndex: 'iconUrl',
      key: 'icon',
      tooltip: true,
      ellipsis: true,
      render: (event: any) => (
        <div>
          <Image
            loader={() => `${event}`}
            src={`${event}`}
            width="50px"
            height="50px"
          />
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (item) => (dateFormatter(item)),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (item) => (dateFormatter(item)),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      render: (index, record) => (
        <Button color="#000" onClick={() => showModal(record, 'edit')}>
          Edit
        </Button>
      ),
    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      key: 'delete',
      render: (index, record) => (
        <Button
          color="#000"
          onClick={() => {
            setModalData(record);
            setIsDeleteModalVisible(true);
          }}
        >
          Remove
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getAllEvents();
  }, []);

  const getAllEvents = async () => {
    await axios
      .get(`${env.nextPublicApiBaseUrl}/users/admin/event`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setData(res.data.events ?? []);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = async () => {
    await axios
      .delete(
        `${env.nextPublicApiBaseUrl}/users/admin/event/${modalData['id']}`,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setData(data.filter((item) => item.id !== modalData['id']));
        }
      })
      .catch((err) => console.error(err));
    setIsDeleteModalVisible(false);
  };

  const uploadIcon = async (formData: FormData) => {
    try {
      const response = await axios.post(
        `${env.nextPublicApiBaseUrl}/files/`,
        formData,
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const onFinish = async (values: ModalDataType) => {
    switch (type) {
      case 'create':
        values['id'] = data.length;
        values['key'] = data.length;

        const response = await uploadIcon(eventIcon);
        values['iconUrl'] = response;

        await axios
          .post(`${env.nextPublicApiBaseUrl}/users/createEvent`, values, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          })
          .then((res) => {
            setData([values, ...data]);
          })
          .catch((err) => console.log(err));
        break;
      case 'edit':
        await axios
          .put(
            `${env.nextPublicApiBaseUrl}/users/admin/update-event/${modalData['id']}`,
            values,
            {
              headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
              },
            }
          )
          .then((res) => {
            if (res.status === 200) {
              const editedData = data;
              for (let i = 0; i < editedData.length; i++) {
                if (editedData[i].id === modalData['id']) {
                  editedData[i] = {
                    ...editedData,
                    ...values,
                  };
                }
              }

              setData(editedData);
            }
          })
          .catch((err) => console.log(err));
        break;
      default:
        break;
    }

    setIsModalVisible(false);
  };

  const showModal = (record: ModalDataType | {}, type: string) => {
    setType(type);
    setModalData(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setModalData({});
    setIsModalVisible(false);
  };

  const closeModal = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <Layout>
      <Content style={{ padding: 50 }}>
        <Button
          color="#000"
          onClick={() =>
            showModal(
              {
                iconUrl: '',
                title: '',
                startDate: '',
                endDate: '',
                location: '',
              },
              'create'
            )
          }
        >
          Add new event
        </Button>
        <Row>
          <Col span={3} />
          <Col span={18}>
            <Table dataSource={[...data]} columns={columns} />
          </Col>
          <Col span={3} />
        </Row>
      </Content>
      {Object.keys(modalData).length && (
        <ModalForChanges
          formFields={formFields}
          handleCancel={handleCancel}
          isModalVisible={isModalVisible}
          submitButtonText={EventEnum[type]}
          modalData={modalData}
          onFinish={onFinish}
          setEventIcon={setEventIcon}
          isEvent
        />
      )}
      <Modal
        visible={isDeleteModalVisible}
        onCancel={closeModal}
        title="Are you sure?"
      >
        <div>
          <Button onClick={handleDelete}> Yes </Button>
          <Button onClick={closeModal}> No </Button>
        </div>
      </Modal>
      <Footer></Footer>
    </Layout>
  );
};
