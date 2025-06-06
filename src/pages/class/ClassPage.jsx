import React, { useEffect, useState } from 'react';
import MainPageLogError from '../../components/MainPageLogError.jsx';
import { request, formatDate } from '../../store/Configstore.js';
import { Button, Form, Input, message, Modal, Select, Space, Table } from 'antd';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useForm } from 'antd/es/form/Form';

const ClassPage = () => {
    const [form] = useForm();
    const [state, setState] = useState({
        list: [],
        loading: false,
        modalVisible: false,
        currentClass: null,
    });

    useEffect(() => {
        getAll();
    }, []);

    const getAll = async () => {
        setState((prev) => ({ ...prev, loading: true }));
        try {
            const res = await request('classes', 'get'); // Changed endpoint to 'class'
            setState((prev) => ({
                ...prev,
                list: res?.data || [],
                loading: false,
            }));
        } catch (error) {
            console.error('Error fetching classes:', error);
            message.error('Failed to fetch classes.');
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const onFinish = async (values) => {
        try {
            const payload = {
                className: values.className,
                classCode: values.classCode,
                academicYear: values.academicYear,
                year: parseInt(values.year, 10),
                semester: values.semester,
                teacherId: values.teacherId ? parseInt(values.teacherId, 10) : null,
            };
            const id = state.currentClass?.id;
            const endpoint = id ? `classes/${id}` : 'classes'; // Changed endpoint to 'class'
            const method = id ? 'put' : 'post';

            const res = await request(endpoint, method, payload);
            if (res) {
                message.success('Class saved successfully');
                form.resetFields();
                setState((prev) => ({
                    ...prev,
                    modalVisible: false,
                    currentClass: null,
                }));
                getAll();
            }
        } catch (error) {
            console.error('Save error:', error);
            message.error('Failed to save class.');
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await request(`classes/${id}`, 'delete'); // Changed endpoint to 'class'
            if (res) {
                message.success(res.message || 'Class deleted successfully');
                setState((prev) => ({
                    ...prev,
                    list: prev.list.filter((c) => c.id !== id),
                }));
            }
        } catch (err) {
            console.error('Delete error:', err);
            message.error('Failed to delete class.');
        }
    };

    const handleAdd = () => {
        setState((prev) => ({
            ...prev,
            modalVisible: true,
            currentClass: null,
        }));
        form.resetFields();
    };

    const handleEdit = (classItem) => {
        setState((prev) => ({
            ...prev,
            modalVisible: true,
            currentClass: classItem,
        }));
        form.setFieldsValue({
            className: classItem.className,
            classCode: classItem.classCode,
            academicYear: classItem.academicYear,
            year: classItem.year.toString(),
            semester: classItem.semester,
            teacherId: classItem.teacherId ? classItem.teacherId.toString() : null,
        });
    };

    return (
        <MainPageLogError loading={state.loading}>
            <div className="flex items-center justify-between py-2">
                <h1>Class Total: {state.list.length}</h1>
                <Button type="primary" onClick={handleAdd}>Add Class</Button>
            </div>

            <Modal
                open={state.modalVisible}
                onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
                onOk={() => form.submit()}
                title={state.currentClass ? 'Edit Class' : 'Add Class'}
                destroyOnClose
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="className"
                        label="Class Name"
                        rules={[{ required: true, message: 'Please enter class name' }]}
                    >
                        <Input placeholder="Class name" />
                    </Form.Item>
                    <Form.Item
                        name="classCode"
                        label="Class Code"
                        rules={[{ required: true, message: 'Please enter class code' }]}
                    >
                        <Input placeholder="Class code" />
                    </Form.Item>
                    <Form.Item
                        name="academicYear"
                        label="Academic Year"
                        rules={[{ required: true, message: 'Please enter academic year' }]}
                    >
                        <Input placeholder="e.g., 2024-2025" />
                    </Form.Item>
                    <Form.Item
                        name="year"
                        label="Year"
                        rules={[
                            { required: true, message: 'Please select year' },
                            { pattern: /^[1-4]$/, message: 'Year must be between 1 and 4' },
                        ]}
                    >
                        <Select placeholder="Select year">
                            <Select.Option value="1">1</Select.Option>
                            <Select.Option value="2">2</Select.Option>
                            <Select.Option value="3">3</Select.Option>
                            <Select.Option value="4">4</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="semester"
                        label="Semester"
                        rules={[{ required: true, message: 'Please select semester' }]}
                    >
                        <Select placeholder="Select semester">
                            <Select.Option value="1">1</Select.Option>
                            <Select.Option value="2">2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="teacherId"
                        label="Teacher ID"
                        rules={[{ required: false }]} // Optional field
                    >
                        <Input placeholder="Teacher ID (optional)" type="number" />
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                dataSource={state.list}
                rowKey="id"
                columns={[
                    { title: 'Class Name', dataIndex: 'className' },
                    { title: 'Class Code', dataIndex: 'classCode' },
                    { title: 'Academic Year', dataIndex: 'academicYear' },
                    { title: 'Year', dataIndex: 'year' },
                    { title: 'Semester', dataIndex: 'semester' },
                    { title: 'Teacher ID', dataIndex: 'teacherId', render: (value) => value || 'N/A' },
                    {
                        title: 'Created At',
                        dataIndex: 'createAt',
                        render: (value) => formatDate(value),
                    },
                    {
                        title: 'Updated At',
                        dataIndex: 'updateAt',
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

export default ClassPage;