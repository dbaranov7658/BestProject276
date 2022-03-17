import {Button, Tag, Tooltip} from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import {PrinterOutlined} from '@ant-design/icons';

const dataSource = [
    {
        key: '1',
        name: 'PIA #1',
        status: 'APPROVED',
        submission_date: '2022-02-01',
    },
    {
        key: '2',
        name: 'PIA #2',
        status: 'PENDING',
        submission_date: '2022-01-06',
    },
    {
        key: '3',
        name: 'PIA #3',
        status: 'REJECTED',
        submission_date: '2021-11-08',
    }
      
];

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: name => {
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
        render: () => (
            <div style={{display: "flex", flexDirection: "row"}}>
            <Tooltip placement="bottom" title={"Print"}>
                <Button type={"link"} style={{flex: "1"}} onClick={() => {alert("Sorry, we are still working on functionality of that button")}}><PrinterOutlined /></Button>
            </Tooltip>
            </div>
        ),
    },
];

const columnsForOfficer = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: name => {
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
        render: () => (
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
            <Tooltip placement="bottom" title={"Delete"} style={{flex: "1"}} > 
                <Button type={"link"}  onClick={() => {alert("Sorry, we are still working on functionality of that button")}}><DeleteOutlined /></Button>
            </Tooltip>
            <Tooltip placement="bottom" title={"Print"} style={{flex: "1"}}>
                <Button type={"link"}  onClick={() => {alert("Sorry, we are still working on functionality of that button")}}><PrinterOutlined /></Button>
            </Tooltip>
            </div>
        ),
    },
];


export {
  dataSource,
  columns,
  columnsForOfficer
};