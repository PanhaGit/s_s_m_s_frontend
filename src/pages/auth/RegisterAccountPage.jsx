import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useNavigate } from 'react-router-dom';
import { request } from '../../store/Configstore.js';

const RegisterAccountPage = () => {
    const [form] = useForm();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getAllRoles();
    }, []);

    const getAllRoles = async () => {
        try {
            const res = await request('roles', 'get');
            setRoles(res?.data || []);
        } catch (error) {
            console.error('Error fetching roles:', error);
            message.error('Failed to fetch roles.');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                username: values.username,
                email: values.email,
                password: values.password,
                role_id: parseInt(values.role_id, 10),
            };
            const res = await request('auth/register', 'post', payload);
            if (res) {
                message.success('Account registered successfully');
                form.resetFields();
                navigate('/');
            }
        } catch (error) {
            console.error('Registration error:', error);
            message.error(error.response?.data?.message || 'Failed to register account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>ចុះឈ្មោះគណនី (Register Account)</h1>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{ role_id: '5' }} // Default to staff role
            >
                <Form.Item
                    name="username"
                    label="ឈ្មោះអ្នកប្រើប្រាស់ (Username)"
                    rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់' }]}
                >
                    <Input placeholder="ឈ្មោះអ្នកប្រើប្រាស់" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="អ៊ីមែល (Email)"
                    rules={[
                        { required: true, message: 'សូមបញ្ចូលអ៊ីមែល' },
                        { type: 'email', message: 'សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ' },
                    ]}
                >
                    <Input placeholder="អ៊ីមែល" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="លេខសម្ងាត់ (Password)"
                    rules={[
                        { required: true, message: 'សូមបញ្ចូលលេខសម្ងាត់' },
                        { min: 6, message: 'លេខសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ' },
                    ]}
                >
                    <Input.Password placeholder="លេខសម្ងាត់" />
                </Form.Item>
                <Form.Item
                    name="role_id"
                    label="តួនាទី (Role)"
                    rules={[{ required: true, message: 'សូមជ្រើសរើសតួនាទី' }]}
                >
                    <Select placeholder="ជ្រើសរើសតួនាទី" loading={!roles.length}>
                        {roles.map((role) => (
                            <Select.Option key={role.id} value={role.id.toString()}>
                                {role.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        ចុះឈ្មោះ (Register)
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterAccountPage;