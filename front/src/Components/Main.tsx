// import "../CSS/App.css";
// @ts-ignore
import Login from "../Components/Login.tsx";
import * as React from "react";

interface State {
  isLogged: boolean;
}

export default class Main extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLogged: false,
    };
  }

  componentDidMount() {}

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ) {}

  render() {
    console.log("test");
    return <Login />;
  }
}
