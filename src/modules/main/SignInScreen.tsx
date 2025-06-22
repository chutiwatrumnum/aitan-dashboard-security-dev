import { Col, Row, Typography, Form, Input, Checkbox, Button } from "antd";
import { Link } from "react-router-dom";
import MediumButton from "../../components/common/MediumButton";
import { requiredRule } from "../../configs/inputRule";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../stores";
import { UserSignInIcon, LockIcon } from "../../assets/icons/Icons";
import { whiteLabel } from "../../configs/theme";
import { LoginPayloadType } from "../../stores/interfaces/User";

import LOGO from "../../assets/images/Central-Pattan-Residence.png";

import type { CheckboxChangeEvent } from "antd/es/checkbox";

import "./styles/signIn.css";
import { encryptStorage } from "../../utils/encryptStorage";

const { Text, Title } = Typography;

const SignInScreen = () => {
  const dispatch = useDispatch<Dispatch>();
  const [form] = Form.useForm();
  const [rememberChecked, setRememberChecked] = useState<boolean>(false);

  useEffect(() => {
    (async function () {
      const statusRemember = await encryptStorage.getItem("statusRemember");
      if (statusRemember) {
        await setRememberChecked(statusRemember);
        const email = await encryptStorage.getItem("email");

        await form.setFieldsValue({
          username: email ? email : undefined,
        });
      }
    })();
  }, []);

  const onFinish = async (values: LoginPayloadType) => {
    if (rememberChecked) {
      await encryptStorage.setItem("email", values.username);
    } else {
      await encryptStorage.removeItem("email");
      await encryptStorage.removeItem("statusRemember");
    }
    await dispatch.userAuth.loginEffects(values);
  };

  const onFinishFailed = (errorInfo: object) => {
    console.log("Failed:", errorInfo);
  };

  const onRememberChange = async (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
    if (e.target.checked) {
      await encryptStorage.setItem("statusRemember", e.target.checked);
    } else {
      await encryptStorage.removeItem("statusRemember");
    }
    await setRememberChecked(e.target.checked);
  };

  return (
    <div className="modern-signin-container">
      <Row className="modern-signin-row">
        {/* Left Side - Form */}
        <Col xs={24} lg={12} className="signin-form-section">
          <div className="modern-form-container">
            {/* Logo and Title */}
            <div className="signin-header">
              <div className="logo-container">
                <img
                  src={LOGO}
                  alt="Central Pattana Residence"
                  className="central-pattana-logo"
                />
              </div>

              <Title level={2} className="signin-title">
                Login
              </Title>
            </div>

            <Form
              name="signin"
              form={form}
              className="modern-signin-form"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off">
              {/* Google Sign In Button */}
              <Button
                size="large"
                block
                className="google-signin-button"
                icon={
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path
                      fill="#4285F4"
                      d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
                    />
                    <path
                      fill="#34A853"
                      d="M8.98 16c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 16z"
                    />
                    <path
                      fill="#EA4335"
                      d="M4.5 9.49H1.83V7.42h2.68A8.09 8.09 0 0 0 8.98 0c2.16 0 3.97.72 5.3 1.94l-2.6 2.04a4.8 4.8 0 0 1-7.18 2.53z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M8.98 3.58c1.22 0 2.32.42 3.18 1.24l2.39-2.4A7.81 7.81 0 0 0 8.98 0a8 8 0 0 0-7.15 4.42l2.67 2.07c.83-1.23 2.07-2.91 4.48-2.91z"
                    />
                  </svg>
                }>
                Sign in with Google
              </Button>

              {/* Divider */}
              <div className="signin-divider">
                <span>Or sign in with email</span>
              </div>

              {/* Email Input */}
              <Form.Item name="username" rules={requiredRule}>
                <Input
                  size="large"
                  placeholder="Email"
                  className="modern-input"
                />
              </Form.Item>

              {/* Password Input */}
              <Form.Item name="password" rules={requiredRule}>
                <Input.Password
                  size="large"
                  placeholder="Password"
                  className="modern-input"
                />
              </Form.Item>

              {/* Options Row */}
              <div className="signin-options">
                <Checkbox
                  checked={rememberChecked}
                  onChange={onRememberChange}
                  className="keep-logged-checkbox">
                  Keep me logged in
                </Checkbox>

                <Link to={"/recovery"} className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className="login-button">
                  Login
                </Button>
              </Form.Item>

              {/* Sign Up Link */}
              <div className="signup-section">
                <Text className="signup-text">
                  Don't have an account?{" "}
                  <Link to="/signup" className="signup-link">
                    Sign up
                  </Link>
                </Text>
              </div>
            </Form>
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
                Changing the way
                <br />
                the world writes
              </h1>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SignInScreen;
