import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Space, Table } from 'antd';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useForm } from 'antd/es/form/Form';
import { request } from '../../store/Configstore.js';

const RolePage = () => {
    const [form] = useForm();
    const [state, setState] = useState({
        list: [],
        loading: false,
        modalVisible: false,
        currentRole: null,
    });

    useEffect(() => {
        getAll();
    }, []);

    const getAll = async () => {
        setState((prev) => ({ ...prev, loading: true }));
        try {
            const res = await request('roles', 'get');
            setState((prev) => ({
                ...prev,
                list: res?.data || [],
                loading: false,
            }));
        } catch (error) {
            console.error('Error fetching roles:', error);
            message.error('Failed to fetch roles.');
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    const onFinish = async (values) => {
        try {
            const payload = {
                role_name: values.role_name,
                code: values.code,
            };
            const id = state.currentRole?.id;
            const endpoint = id ? `roles/${id}` : 'roles';
            const method = id ? 'put' : 'post';

            const res = await request(endpoint, method, payload);
            if (res) {
                message.success(`Role ${id ? 'updated' : 'created'} successfully`);
                form.resetFields();
                setState((prev) => ({
                    ...prev,
                    modalVisible: false,
                    currentRole: null,
                }));
                getAll();
            }
        } catch (error) {
            console.error('Save error:', error);
            message.error(error.response?.data?.message || 'Failed to save role.');
        }
    };

    const handleDelete = async (id) => {
        const res = await request(`roles/${id}`, 'delete');
        if (res) {
            message.success(res.message || 'Role deleted successfully');
            setState((prev) => ({
                ...prev,
                list: prev.list.filter((r) => r.id !== id),
            }));
        }
    };

    const handleAdd = () => {
        setState((prev) => ({
            ...prev,
            modalVisible: true,
            currentRole: null,
        }));
        form.resetFields();
    };

    const handleEdit = (role) => {
        setState((prev) => ({
            ...prev,
            modalVisible: true,
            currentRole: role,
        }));
        form.setFieldsValue({
            role_name: role.role_name,
            code: role.code,
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h1>គ្រប់គ្រងតួនាទី (Manage Roles): {state.list.length}</h1>
                <Button type="primary" onClick={handleAdd}>
                    បន្ថែមតួនាទី (Add Role)
                </Button>
            </div>

            <Modal
                open={state.modalVisible}
                onCancel={() => setState((prev) => ({ ...prev, modalVisible: false }))}
                onOk={() => form.submit()}
                title={state.currentRole ? 'កែសម្រួលតួនាទី (Edit Role)' : 'បន្ថែមតួនាទី (Add Role)'}
                destroyOnClose
            >
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="role_name"
                        label="ឈ្មោះតួនាទី (Role Name)"
                        rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះតួនាទី' }]}
                    >
                        <Input placeholder="ឈ្មោះតួនាទី" />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label="កូដ (Code)"
                        rules={[{ required: true, message: 'សូមបញ្ចូលកូដ' }]}
                    >
                        <Input placeholder="កូដ" />
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                dataSource={state.list}
                rowKey="id"
                loading={state.loading}
                columns={[
                    { title: 'ឈ្មោះតួនាទី (Role Name)', dataIndex: 'role_name' },
                    { title: 'កូដ (Code)', dataIndex: 'code' },
                    { title: 'បង្កើតដោយ (Created By)', dataIndex: 'createdBy', render: (value) => value || 'N/A' },
                    {
                        title: 'សកម្មភាព (Actions)',
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
        </div>
    );
};

export default RolePage;