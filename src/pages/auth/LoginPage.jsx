import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useNavigate, Link } from "react-router-dom";
import { setAcccessToken, setProfile } from "../../store/profile.js";
import { request } from "../../store/Configstore.js";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const param = {
                email: values.username,
                password: values.password,
            };
            const res = await request("auth/login", "post", param);
            // console.log(res.data.token);
            if (res && !res.error) {
                setAcccessToken(res.data.token);
                setProfile(JSON.stringify(res.data));
                message.success(res.message || "Login successful");
                navigate("/");
            } else {
                message.error(res?.message || "ការចូលប្រើបានបរាជ័យ។");
            }
        } catch (error) {
            message.error(error.response?.data?.message || error.message || "ការចូលប្រើបានបរាជ័យ។");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        message.info(`សូមអរគុណសម្រាប់ការចូលប្រើប្រាស់ជាមួយ ${provider}`);
    };

    return (
        <Spin spinning={loading} tip="កំពុងផ្ទុក...">
            <div className="w-full font-Kantumruy_pro max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">សូមចូលប្រើប្រាស់គណនីរបស់អ្នក</h1>
                </div>

                <Form
                    form={form}
                    name="normal_login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        label="អ៊ីមែលឬឈ្មោះអ្នកប្រើប្រាស់"
                        rules={[
                            {
                                required: true,
                                message: 'សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ឬអ៊ីមែល!'
                            },
                            {
                                type: 'email',
                                message: 'សូមបញ្ចូលអ៊ីមែលដែលត្រឹមត្រូវ!'
                            }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="អ៊ីមែលរបស់អ្នក"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="ពាក្យសម្ងាត់"
                        rules={[
                            {
                                required: true,
                                message: 'សូមបញ្ចូលពាក្យសម្ងាត់!'
                            },
                            {
                                min: 6,
                                message: 'ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 6 តួអក្សរ!'
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="ពាក្យសម្ងាត់របស់អ្នក"
                            size="large"
                        />
                    </Form.Item>

                    <div className="flex justify-between mb-6">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>ចងចាំខ្ញុំ</Checkbox>
                        </Form.Item>

                        <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
                            ភ្លេចពាក្យសម្ងាត់?
                        </Link>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full"
                            size="large"
                            loading={loading}
                        >
                            ចូលប្រើប្រាស់
                        </Button>
                    </Form.Item>
                </Form>

                <Divider plain>ឬចូលប្រើប្រាស់ជាមួយ</Divider>

                <div className="flex justify-center space-x-4 mb-6">
                    <Button
                        icon={<GoogleOutlined />}
                        className="flex items-center justify-center"
                        shape="circle"
                        size="large"
                        onClick={() => handleSocialLogin('Google')}
                    />
                    <Button
                        icon={<FacebookOutlined />}
                        className="flex items-center justify-center"
                        shape="circle"
                        size="large"
                        onClick={() => handleSocialLogin('Facebook')}
                    />
                </div>

                <div className="mt-6 text-center">
                    <span className="text-gray-600">មិនទាន់មានគណនីទេ? </span>
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                        ចុះឈ្មោះ
                    </Link>
                </div>
            </div>
        </Spin>
    );
};