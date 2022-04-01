import * as React from "react";
import '../CSS/App.css';
import '../CSS/PTable.css';
import {Row, Table, Button, Tag, Tooltip, Popconfirm, message} from 'antd';
// @ts-ignore
import {Link} from "react-router-dom";
import {piaInfo} from "../consts/interfaces";
import {tableData} from "../consts/interfaces";
import {DeleteOutlined, PrinterOutlined} from "@ant-design/icons";



interface Props{
    isOfficer: boolean,
    email: string
}

interface State{
    isOfficer: boolean
    allPia: piaInfo[]
    tableData: tableData[]
}



class PTable extends React.Component<Props, State> {
        columns: any[]
        columnsForOfficer: any[]
        constructor(props: any){
        super(props);
        this.emailNewPia = this.emailNewPia.bind(this);
        this.emailCommentPia = this.emailCommentPia.bind(this);
        this.emailEditPia = this.emailEditPia.bind(this);
        this.emailApprovePia = this.emailApprovePia.bind(this);
        this.emailRejectPia = this.emailRejectPia.bind(this);
        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (name, key) => {
                    return <Link to="editPia:">{ name }</Link>
                },
                sorter: (a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    } else return -1;
                },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: status => {
                    console.log(status);
                    let color = 'geekblue';
                    switch (status) {
                        case 'APPROVED':
                            color = 'green';
                            break;
                        case 'REJECTED':
                            color = 'volcano';
                            break;
                        default:
                            color = 'geekblue';
                    }
                    return (
                        <Tag color={color} key={status}>
                            {status}
                        </Tag>
                    );
                },
                filters: [
                    {
                        text: 'APPROVED',
                        value: 'APPROVED'
                    },
                    {
                        text: 'REJECTED',
                        value: 'REJECTED'
                    },
                    {
                        text: 'PENDING',
                        value: 'PENDING'
                    }
                ],
                onFilter: (value, record) => record.status.indexOf(value) === 0,
            },
            {
                title: 'Date Submitted',
                dataIndex: 'submission_date',
                key: 'submission_date',
                sorter: (a, b) => Date.parse(a.submission_date) - Date.parse(b.submission_date),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'Action',
                key: 'action',
                width: '100px',
                dataIndex: 'status',

                render: status => {
                    if(status === "APPROVED"){
                        return (
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <Tooltip placement="bottom" title={"Print"}>
                                    <Button type={"link"} style={{flex: "1"}} onClick={() => {alert("Download PIA Function")}}><PrinterOutlined /></Button>
                                </Tooltip>
                            </div>
                        );
                    }
                },
            },
        ];
        this.columnsForOfficer = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (name, key) => {
                    return <a>{ name }</a>
                },
                sorter: (a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    } else return -1;
                },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: status => {
                    console.log(status);
                    let color = 'geekblue';
                    switch (status) {
                        case 'APPROVED':
                            color = 'green';
                            break;
                        case 'REJECTED':
                            color = 'volcano';
                            break;
                        default:
                            color = 'geekblue';
                    }
                    return (
                        <Tag color={color} key={status}>
                            {status}
                        </Tag>
                    );
                },
                filters: [
                    {
                        text: 'APPROVED',
                        value: 'APPROVED'
                    },
                    {
                        text: 'REJECTED',
                        value: 'REJECTED'
                    },
                    {
                        text: 'PENDING',
                        value: 'PENDING'
                    }
                ],
                onFilter: (value, record) => record.status.indexOf(value) === 0,
            },
            {
                title: 'Date Submitted',
                dataIndex: 'submission_date',
                key: 'submission_date',
                sorter: (a, b) => Date.parse(a.submission_date) - Date.parse(b.submission_date),
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'Action',
                key: 'action',
                width: '100px',
                render: (status, key) => {
                    return (
                        <div style={{display: "flex", flexDirection: "row", height: "100%", width: "100%", justifyContent:"left"}}>

                            <Tooltip placement="bottom" title={"Delete"}>
                                <Popconfirm
                                    title="Are you sure to delete this PIA?"
                                    onConfirm={() => { this.deletePia(key)}}
                                    onCancel={() => {}}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type={"link"} onClick={() => {

                                    }}><DeleteOutlined /></Button>
                                </Popconfirm>
                            </Tooltip>

                            {status.status === 'APPROVED' ?
                                <Tooltip placement="bottom" title={"Print"} style={{flex: "1"}}>
                                    <Button type={"link"}  onClick={() => {alert("Download PIA Function")}}><PrinterOutlined /></Button>
                                </Tooltip>
                                :
                                <h1></h1>
                            }
                        </div>


                    );

                },
            },
        ];
        this.state = {
            isOfficer: this.props.isOfficer,
            allPia: [],
            tableData: []
        };
    }

    async emailNewPia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailNewPia/:${this.props.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } catch(err) {
            console.log(err);
        }
    } 
    
    async emailCommentPia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailCommentPia/:${this.props.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } catch(err) {
            console.log(err);
        }
    }  
    
    async emailEditPia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailEditPia/:${this.props.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } catch(err) {
            console.log(err);
        }
    }    

    async emailApprovePia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailApprovePia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then(data => console.log(data));
        } catch(err) {
            console.log(err);
        }
    }    

    async emailRejectPia() {
        try {
            console.log(this.props.email);
            await fetch(`v1/email/emailRejectPia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
            }).then(response => response.json()).then(
                data =>
                    console.log(data));
        } catch(err) {
            console.log(err);
        }
    }    
    
    componentDidMount() {
        this.getAllPia()
    }

    async getAllPia() {
        try {
            await fetch(`/getAllPia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "x-access-token": localStorage.getItem("token")},
            })
                .then(response => response.json())
                .then((data) => {
                    if (!data.isSuccess){
                        console.log(data.error)
                    }
                    else{
                        this.setState({allPia: data.allPia})
                        let newArr: tableData[] = []
                        this.state.allPia.forEach((el: piaInfo, index) => {
                            newArr.push({key: index.toString(), name: el.pia.projectName, status: el.status, submission_date: el.createdAt.substr(0, 10)})

                        })
                        this.setState({tableData: newArr})
                    }

                    });
        } catch(err) {
            console.log(err);
        }
    }

    async deletePia(key: any) {
            let arrIndex = parseInt(key.key)
        try {
            await fetch(`/deletePia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "x-access-token": localStorage.getItem("token")},
                body: JSON.stringify({id: this.state.allPia[arrIndex]._id})
            })
                .then(response => response.json())
                .then((data) => {
                    if (!data.isSuccess){
                        console.log(data.message)
                    }
                    else{
                        message.success(data.message)
                        this.getAllPia()
                    }

                });
        } catch(err) {
            console.log(err);
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.isOfficer !== this.state.isOfficer){
            this.setState({isOfficer: this.props.isOfficer})
        }
    }

    render() {
        return (
            <div className='page-body'>
                {this.props.isOfficer ?
                    <h1>All PIAs</h1>
                    :
                    <h1>Your PIAs</h1>
                }
                <Table dataSource={this.state.tableData} columns={this.state.isOfficer ? this.columnsForOfficer : this.columns} />
                <Row>
                    <Link to="/addNew">
                    <Button style={{backgroundColor: "#ffc82c", color: "#173a64", border: "none"}} type="primary">New PIA</Button>
                    </Link>
                </Row>
                <p style={{ paddingTop: "2rem" }}>Email test buttons: </p>
                <Row>
                    <Button type="primary" onClick={this.emailNewPia} style={{marginRight: "40px"}}>Submit new PIA</Button>
                    <Button type="primary" onClick={this.emailCommentPia} style={{ marginRight: "40px" }}>Comment on PIA</Button>
                    <Button type="primary" onClick={this.emailEditPia} style={{ marginRight: "40px" }}>Edit PIA</Button>
                    <Button type="primary" onClick={this.emailApprovePia} style={{ marginRight: "40px" }}>Approve PIA</Button>
                    <Button type="primary" onClick={this.emailRejectPia} style={{marginRight: "40px"}}>Reject PIA</Button>
                </Row>
            </div>
        );
    }
}
export default PTable;