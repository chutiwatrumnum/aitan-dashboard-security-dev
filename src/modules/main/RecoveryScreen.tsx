import { useRef } from "react";
import { Col, Row, Typography, Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import { emailRule } from "../../configs/inputRule";
import SuccessModal from "../../components/common/SuccessModal";
import FailedModal from "../../components/common/FailedModal";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../stores";
import { useNavigate } from "react-router-dom";

import LOGO from "../../assets/images/Central-Pattan-Residence.png";
import type { FormInstance } from "antd/es/form";

import "./styles/forgotPassword.css";

const { Text, Title } = Typography;

const RecoveryScreen = () => {
  const dispatch = useDispatch<Dispatch>();
  const formRef = useRef<FormInstance>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    const result = await dispatch.userAuth.recoveryByEmail(values);
    if (result) {
      SuccessModal("An email has been successfully sent.");
      setTimeout(() => navigate("/auth"), 3000);
    }
  };

  const onFinishFailed = (errorInfo: object) => {
    FailedModal("Enter the error code back to fix it.");
    console.log("Failed:", errorInfo);
  };

  const onCancel = () => {
    formRef.current?.resetFields();
    navigate(-1);
  };

  return (
    <div className="modern-recovery-container">
      <Row className="modern-recovery-row">
        {/* Left Side - Form */}
        <Col xs={24} lg={12} className="recovery-form-section">
          <div className="modern-recovery-form-container">
            {/* Logo and Header */}
            <div className="recovery-header">
              <div className="logo-container">
                <img
                  src={LOGO}
                  alt="Central Pattana Residence"
                  className="central-pattana-logo"
                />
              </div>

              <Title level={2} className="recovery-title">
                Forgot Password?
              </Title>

              <Text className="recovery-subtitle">
                Enter your email to receive further guidance
              </Text>
            </div>

            <Form
              name="recovery"
              ref={formRef}
              form={form}
              className="modern-recovery-form"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off">
              {/* Email Input */}
              <Form.Item name="email" rules={emailRule}>
                <Input
                  size="large"
                  placeholder="Email"
                  className="modern-input"
                />
              </Form.Item>

              {/* Action Buttons */}
              <div className="recovery-actions">
                <Button
                  size="large"
                  className="cancel-button"
                  onClick={onCancel}>
                  Cancel
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="send-button">
                  Send
                </Button>
              </div>
            </Form>

            {/* Back to Login */}
            <div className="back-to-login">
              <Text className="back-text">
                Remember your password?{" "}
                <Link to="/auth" className="back-link">
                  Sign in
                </Link>
              </Text>
            </div>
          </div>
        </Col>

        {/* Right Side - Illustration */}
        <Col xs={0} lg={12} className="modern-illustration-section">
          <div className="illustration-content">
            {/* Background Shapes */}
            <div className="bg-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              <div className="shape shape-4"></div>
              <div className="shape shape-5"></div>
              <div className="shape shape-6"></div>
            </div>

            {/* Main Text */}
            <div className="main-text">
              <h1>
                Reset your password
                <br />
                with ease
              </h1>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RecoveryScreen;