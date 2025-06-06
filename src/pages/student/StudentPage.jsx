import React, { useEffect, useState } from 'react';
import MainPageLogError from '../../components/MainPageLogError.jsx';
import { request, formatDate } from '../../store/Configstore.js';
import { Button, Form, Input, message, Modal, Select, Space, Table, DatePicker } from 'antd';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';

const StudentPage = () => {
    const [form] = useForm();
    const [state, setState] = useState({
        list: [],
        loading: false,
        modalVisible: false,
        currentStudent: null,
    });

    useEffect(() => {
        getAll();
    }, []);

    const getAll = async () => {
        setState((prev) => ({ ...prev, loading: true }));
        try {
            const res = await request('student', 'get');
            setState((prev) => ({
                ...prev,
                list: res?.data || [],
                loading: false,
            }));
        } catch (error) {
            console.error('Error fetching students:', error);
            message.error('Failed to fetch students.');
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                dob: values.dob?.format('YYYY-MM-DDTHH:mm:ss') || null,
                enrollment_date: values.enrollment_date?.format('YYYY-MM-DDTHH:mm:ss') || null,
                gender: values.gender === 'true',
                status: values.status === 'true',
                classes: values.classes || null,
            };
            const id = state.currentStudent?.id;
            const endpoint = id ? `student/${id}` : 'student';
            const method = id ? 'put' : 'post';

            const res = await request(endpoint, method, payload);
            if (res) {
                message.success('Student saved successfully');
                form.resetFields();
                setState((prev) => ({
                    ...prev,
                    modalVisible: false,
                    currentStudent: null,
                }));
                getAll();
            }
        } catch (error) {
            console.error('Save error:', error);
            message.error('Failed to save student.');
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await request(`student/${id}`, 'delete');
            if (res) {
                message.success(res.message || 'Student deleted successfully');
                setState((prev) => ({
                    ...prev,
                    list: prev.list.filter((s) => s.id !== id),
                }));
            }
        } catch (err) {
            console.error('Delete error:', err);
            message.error('Failed to delete student.');
        }
    };

    const handleAdd = () => {
        setState((prev) => ({
            ...prev,
            modalVisible: true,
            currentStudent: null,
        }));
        form.resetFields();
    };

    const handleEdit = (student) => {
        setState((prev) => ({
            ...prev,
            modalVisible: true,
            currentStudent: student,
        }));
        form.setFieldsValue({
            first_name: student.first_name,
            last_name: student.last_name,
            dob: student.dob ? moment(student.dob) : null,
            gender: student.gender.toString(),
            email: student.email,
            phone_number: student.phone_number,
            address: student.address,
            enrollment_date: student.enrollment_date ? moment(student.enrollment_date) : null,
            status: student.status.toString(),
            classes: student.classIds?.[0] || null,
        });
    };

    return (
        <MainPageLogError loading={state.loading}>
            <div className="flex items-center justify-between py-2">
                <h1>Student Total: {state.list.length}</h1>
                <Button type="primary" onClick={handleAdd}>Add Student</Button>
            </div>

            <Modal
                open={state.modalVisible}
                onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
                onOk={() => form.submit()}
                title={state.currentStudent ? 'Edit Student' : 'Add Student'}
                destroyOnClose
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                        <Input placeholder="First name" />
                    </Form.Item>
                    <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                        <Input placeholder="Last name" />
                    </Form.Item>
                    <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                        <Select placeholder="Select gender">
                            <Select.Option value="true">Male</Select.Option>
                            <Select.Option value="false">Female</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true }]}>
                        <Input placeholder="Phone number" />
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                        <Input placeholder="Address" />
                    </Form.Item>
                    <Form.Item name="enrollment_date" label="Enrollment Date" rules={[{ required: true }]}>
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select placeholder="Select status">
                            <Select.Option value="true">Active</Select.Option>
                            <Select.Option value="false">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="classes" label="Class ID">
                        <Input placeholder="Class ID (optional)" />
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                dataSource={state.list}
                rowKey="id"
                columns={[
                    { title: 'First Name', dataIndex: 'first_name' },
                    { title: 'Last Name', dataIndex: 'last_name' },
                    { title: 'Email', dataIndex: 'email' },
                    { title: 'Phone Number', dataIndex: 'phone_number' },
                    { title: 'Address', dataIndex: 'address' },
                    {
                        title: 'Date of Birth',
                        dataIndex: 'dob',
                        render: (value) => formatDate(value),
                    },
                    {
                        title: 'Enrollment Date',
                        dataIndex: 'enrollment_date',
                        render: (value) => formatDate(value),
                    },
                    {
                        title: 'Gender',
                        dataIndex: 'gender',
                        render: (value) => (value ? 'Male' : 'Female'),
                    },
                    {
                        title: 'Status',
                        dataIndex: 'status',
                        render: (value) => (value ? 'Active' : 'Inactive'),
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

export default StudentPage;
