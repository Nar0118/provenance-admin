import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Row, Col } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import { CrudEnum, TextModalEnum } from 'utils/constants/crudName';
import { ButtonType } from 'components/shared/button/type';
import Button from 'components/shared/button';
import Modal from 'components/shared/modal';

import styles from './users.module.scss';
import { ModalForChanges } from 'components/shared/modalForChanges';
import env from 'utils/constants/env';

const formFields = [
  {
    name: 'name',
    field_name: 'name',
    type: 'name',
  },
  {
    name: 'email',
    field_name: 'email',
    type: 'email',
  },
  {
    name: 'address',
    field_name: 'address',
    type: 'name',
  },
];

export default function Users(): JSX.Element {
  const [data, setData] = useState<any>([]);
  const [modalData, setModalData] = useState<any>({});
  const [type, setType] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<any>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(
    false
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'uname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'uemail',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'uaddress',
    },
    {
      title: 'Edit',
      dataIndex: 'id',
      key: 'id',
      render: (index: number, record: any) => (
        <div className={styles.crudSection} key={index}>
          <Button
            text={TextModalEnum.EDIT_USER}
            btnType={ButtonType.edit}
            onClick={() => showModal(record, CrudEnum.EDIT)}
          />
          <Button
            text={TextModalEnum.DELETE_USER}
            btnType={ButtonType.edit}
            onClick={() => deleteUser(record)}
          />
        </div>
      ),
    },
  ];

  const onFinish = (data) => {
    if (type === CrudEnum.CREATE) {
      handleCreate(data);
      setModalData({});
    } else if (type === CrudEnum.EDIT) {
      handlerEdit(data);
    }
  };

  const handleCreate = async (val) => {
    await axios.post(`${env.nextPublicApiBaseUrl}/users/createUser`, val, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setData([res.data.data, ...data]);
      })
      .catch((err) => console.log(err));
    setIsModalVisible(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteUser = (id: any): void => {
    setIsDeleteModalVisible(true);
    setUserId(id);
  };

  const showModal = (record, type) => {
    setType(type);
    if (type === CrudEnum.EDIT) {
      setModalData(record);
    } else if (type === CrudEnum.CREATE) {
      setModalData({});
    }
    setIsModalVisible(true);
  };

  const closeModal = (): void => {
    setIsDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    await axios
      .delete(`${env.nextPublicApiBaseUrl}/users/admin/${userId.id}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          role: 'admin',
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setData(data?.filter((item: any) => item.id !== userId.id));
        }
      })
      .catch((err) => console.log(err));
    setIsDeleteModalVisible(false);
  };

  const handleCancel = () => {
    setModalData({});
    setIsModalVisible(false);
  };

  const handlerEdit = async (modal) => {
    const editUser = {
      ...modalData,
      ...modal,
    };
    await axios
      .put(
        `${env.nextPublicApiBaseUrl}/users/admin/update-user/${editUser?.id}`,
        modal,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          const newData = [...data];

          for (let i = 0; i < newData.length; i++) {
            if (newData[i]?.id === editUser?.id) {
              newData[i] = editUser;
              break;
            }
          }
          setData(newData);
        }
      })
      .catch((err) => console.log(err));
    setIsModalVisible(false);
  };

  const getData = async () => {
    await axios
      .get(`${env.nextPublicApiBaseUrl}/users/admin`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setData(
          res?.data?.users?.map((row, index) => ({
            key: index,
            id: row.id,
            name: row.name,
            email: row.email,
            address: row.address,
          }))
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <Layout>
      <Content style={{ padding: 50 }}>
        <Button
          onClick={() => showModal(modalData, CrudEnum.CREATE)}
          text={TextModalEnum.Create_USER}
          btnType={ButtonType.edit}
          className={styles.addUser}
        />
        <Row>
          <Col span={3} />
          <Col span={18}>
            <Table dataSource={data} columns={columns} />
          </Col>
          <Col span={3} />
        </Row>
      </Content>
      <ModalForChanges
        submitButtonText={type === CrudEnum.EDIT
          ? TextModalEnum.EDIT_USER
          : type === CrudEnum.CREATE
            ? TextModalEnum.Create_USER
            : ''}
        modalData={modalData}
        formFields={formFields}
        handleCancel={handleCancel}
        onFinish={onFinish}
        isModalVisible={isModalVisible} setEventIcon={undefined}      />

      <Modal
        visible={isDeleteModalVisible}
        onOk={deleteUser}
        onCancel={closeModal}
        title="Delete User ?"
      >
        <div className={styles.deleteUserSection}>
          <Button
            btnType={ButtonType.black}
            text="Yes"
            onClick={handleDelete}
          />
          <Button btnType={ButtonType.black} text="No" onClick={closeModal} />
        </div>
      </Modal>
    </Layout>
  );
}
