import React, { useEffect, useState } from 'react';
import MainPageLogError from '../../components/MainPageLogError.jsx';
import { request, formatDate } from '../../store/Configstore.js';
import { Button, Form, Input, message, Modal, Select, Space, Table } from 'antd';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useForm } from 'antd/es/form/Form';

const TeacherPage = () => {
    const [form] = useForm();
    const [state, setState] = useState({
        list: [],
        loading: false,
        modalVisible: false,
        currentTeacher: null,
    });

    useEffect(() => {
        getAll();
    }, []);

    const getAll = async () => {
        setState((prev) => ({ ...prev, loading: true }));
        try {
            const res = await request('teacher', 'get'); // Changed endpoint to 'teacher'
            setState((prev) => ({
                ...prev,
                list: res?.data || [],
                loading: false,
            }));
        } catch (error) {
            console.error('Error fetching teachers:', error);
            message.error('Failed to fetch teachers.');
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const onFinish = async (values) => {
        try {
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                email: values.email,
                address: values.address,
                department_id: values.department_id || null,
            };
            const id = state.currentTeacher?.id;
            const endpoint = id ? `teacher/${id}` : 'teacher'; // Changed endpoint to 'teacher'
            const method = id ? 'put' : 'post';

            const res = await request(endpoint, method, payload);
            if (res) {
                message.success('Teacher saved successfully');
                form.resetFields();
                setState((prev) => ({
                    ...prev,
                    modalVisible: false,
                    currentTeacher: null,
                }));
                getAll();
            }
        } catch (error) {
            console.error('Save error:', error);
            message.error('Failed to save teacher.');
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await request(`teacher/${id}`, 'delete'); // Changed endpoint to 'teacher'
            if (res) {
                message.success(res.message || 'Teacher deleted successfully');
                setState((prev) => ({
                    ...prev,
                    list: prev.list.filter((t) => t.id !== id),
                }));
            }
        } catch (err) {
            console.error('Delete error:', err);
            message.error('Failed to delete teacher.');
        }
    };

    const handleAdd = () => {
        setState((prev) => ({
            ...prev,
            modalVisible: true,
            currentTeacher: null,
        }));
        form.resetFields();
    };

    const handleEdit = (teacher) => {
        setState((prev) => ({
            ...prev,
            modalVisible: true,
            currentTeacher: teacher,
        }));
        form.setFieldsValue({
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            phoneNumber: teacher.phoneNumber,
            email: teacher.email,
            address: teacher.address,
            department_id: teacher.departmentID || null,
        });
    };

    return (
        <MainPageLogError loading={state.loading}>
            <div className="flex items-center justify-between py-2">
                <h1>Teacher Total: {state.list.length}</h1>
                <Button type="primary" onClick={handleAdd}>Add Teacher</Button>
            </div>

            <Modal
                open={state.modalVisible}
                onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
                onOk={() => form.submit()}
                title={state.currentTeacher ? 'Edit Teacher' : 'Add Teacher'}
                destroyOnClose
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter first name' }]}
                    >
                        <Input placeholder="First name" />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter last name' }]}
                    >
                        <Input placeholder="Last name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please enter phone number' }]}
                    >
                        <Input placeholder="Phone number" />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Please enter address' }]}
                    >
                        <Input placeholder="Address" />
                    </Form.Item>
                    <Form.Item
                        name="department_id"
                        label="Department ID"
                        rules={[{ required: false }]} // Optional field
                    >
                        <Input placeholder="Department ID (optional)" type="number" />
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                dataSource={state.list}
                rowKey="id"
                columns={[
                    { title: 'First Name', dataIndex: 'firstName' },
                    { title: 'Last Name', dataIndex: 'lastName' },
                    { title: 'Email', dataIndex: 'email' },
                    { title: 'Phone Number', dataIndex: 'phoneNumber' },
                    { title: 'Address', dataIndex: 'address' },
                    { title: 'Department ID', dataIndex: 'departmentID', render: (value) => value || 'N/A' },
                    {
                        title: 'Created At',
                        dataIndex: 'createdAt',
                        render: (value) => formatDate(value),
                    },
                    {
                        title: 'Updated At',
                        dataIndex: 'updatedAt',
                        render: (value) => formatDate(value),
                    },
                    {
                        title: 'Actions',
                        key: 'actions',
                        render: (item) => (
                            <Space>
                                <Button icon={<MdEdit />} onClick={() => handleEdit(item)} />
                                <Button icon={<MdDelete />} danger onClick={() => handleDelete(item.id)} />
                            </Space>
                        ),
                    },
                ]}
            />
        </MainPageLogError>
    );
};

export default TeacherPage;