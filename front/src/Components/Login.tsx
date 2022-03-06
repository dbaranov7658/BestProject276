import { Form, Input, Button, Image } from "antd";
import { Component } from "react";
import "../CSS/App.less";
export class Login extends Component {
  render() {
    return (
      <div className="container">
        <Form>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" id="loginBtn">
              Login In With Azure
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Login;
