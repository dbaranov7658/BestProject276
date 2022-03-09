import {Button} from "antd";
import * as React from "react";
import {PublicClientApplication} from '@azure/msal-browser';
import {config } from '../azure/Config';
import '../CSS/App.css';
import Axios from "axios"

interface State {
}

interface Props {
    setId?: (value:string) => void,
    setEmail?: (value:string) => void,
    pcl: PublicClientApplication,
}

class Login extends React.Component<Props, State>  {
    //https://www.youtube.com/watch?v=4pH5spE2Yss

    constructor(props: any){
        super(props);
        this.state ={
        };
    }

    async login() {
        try{
            await this.props.pcl.loginPopup(
                {
                    scopes: config.scopes,
                    prompt: "select_account"
                });
            let email = this.props.pcl.getAllAccounts()[0].username
            let id = this.props.pcl.getAllAccounts()[0].localAccountId
                this.props.setEmail(email)
                this.props.setId(id)
           /* const data = {email: "test", id: "test"}
                fetch(window.location.origin.toString() + '/login', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data)
                }).then((response) => {
                    alert(response)
                })*/
               /* await Axios.post(window.location.origin.toString() + '/login', {
                    email: "test",
                    id: "test"
                }).then((response) => {
                    alert(response)
                })*/
            }
        catch(err){
            console.log(err)
        }
    }


    componentDidMount() {
    }

    render(){
        return (
        <div className="login">
            <div id="login-section">
                <div style={{width: "100vw"}}>
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/97/FortisBC_logo.svg/1280px-FortisBC_logo.svg.png" id="logo-login" style={{width: "100vw"}}/>
                    <Button size="large" style={{ background: " #173a64", borderColor: "#173a64", marginLeft:"50vw",}} type="primary" value="large" onClick={() => this.login()}  >Login</Button>
                </div>
            </div>
        </div>
        );
    }
}


export default Login;