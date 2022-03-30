
import { LoginOutlined } from '@ant-design/icons';
import '../CSS/App.css';
import '../CSS/Main.css';
// @ts-ignore
import Login from '../Components/Login.tsx'
import * as React from "react";
// @ts-ignore
import PTable from "../Components/PTable.tsx";
// @ts-ignore
import PageNotFound from '../Components/PageNotFound.tsx';
import {Button, Col, Row, Tooltip} from "antd";
import {Routes, Route} from 'react-router-dom'

// @ts-ignore
import NewPia from "../Components/NewPia.tsx";
import {PublicClientApplication} from "@azure/msal-browser";
import {config } from '../azure/Config';
// @ts-ignore
import {fortisLogoForMain} from "../consts/Photos.tsx";


interface State {
    email: string
    pcl: PublicClientApplication
}

export function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

export default  class Main extends React.Component<any, State> {


    constructor(props: any) {
        super(props);
        this.state = {
            email: undefined,
            pcl: undefined
        }
    }

    getPublicClientApplication = () => {
        this.setState({pcl: new PublicClientApplication({
                auth: {
                    clientId: config.appId,
                    redirectUri: config.redirectUri,
                    authority: config.authority
                },
                cache: {
                    cacheLocation: "sessionStorage",
                    storeAuthStateInCookie: true
                }
            })})
    }

    async componentDidMount() {
        this.getPublicClientApplication()
        this.isAuth()
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if ((this.state.email === undefined) && localStorage.getItem("token") !== null ){
            this.isAuth()
        }
    }

    async isAuth() {
        await fetch('/isUserAuth', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', "x-access-token": localStorage.getItem("token")},
        }).then((response) => {
            response.json().then((res) => {
                if (!res.auth){
                    console.log(res.status)
                    this.logOut()
                }
                else{
                    this.setState({email: res.email})
                }
            })
        })
    }

    setEmail = (newEmail: string) => {
        this.setState({email: newEmail})
    }


    logOut = () => {
        deleteAllCookies()
        sessionStorage.clear();
        localStorage.clear()
        this.setState({email: undefined})
    }


    renderMenu = () => {
        return (
            <div>
                <Row style={{height: "100px", width: "100%", position: "fixed", top: 0, boxShadow: "0 2px 8px #f0f1f2",zIndex: 1000, backgroundColor: "white"}}>
                    <Col span={12} style={{paddingTop: "20px", paddingLeft: "25px", height: "80px"}}>
                       {fortisLogoForMain}
                    </Col>
                    <Col span={12}>
                        <Row style={{paddingRight: "25px", justifyContent: "flex-end", alignItems: "center", height: "80px", paddingTop: "10px"}}>
                            <div className={'text'} style={{paddingRight: "20px"}}>{this.state.email}</div>
                            <Tooltip placement="bottom" title={"Log out"}>
                            <Button ghost={true} type="link" onClick={this.logOut} shape="circle"><LoginOutlined  style={{color: "#000000"}} /></Button>
                            </Tooltip>
                        </Row>
                    </Col>
                </Row>

                <Routes>
                    <Route path="/addNew" element={localStorage.getItem("isOfficer") === "true" ? <PageNotFound /> : <NewPia email={this.state.email}/>}/>
                    <Route path="/" element={<PTable email={this.state.email} />}/>
                    <Route path="/editPia:id" element={<PTable email={this.state.email} />}/>
                    <Route path="*" element={<PageNotFound />}/> 
                </Routes>
            </div>
        )
    }



    render() {
       return (

          localStorage.getItem("token") === null ?
         <Login setEmail={this.setEmail} pcl={this.state.pcl}/>
               :
         this.renderMenu()

       )
    }



}

