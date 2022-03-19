import * as React from "react";
import '../CSS/App.css';
import '../CSS/PTable.css';
import { Row, Table, Button } from 'antd';
// @ts-ignore
import {dataSource, columns, columnsForOfficer} from '../consts/TableSetup.tsx';
import {Link} from "react-router-dom";

import {PDFExport, savePDF} from '@progress/kendo-react-pdf';
import {useRef} from 'react';


interface Props{
    isOfficer: boolean
}

interface State{
    isOfficer: boolean
}

class PTable extends React.Component<Props, State> {
    private pdfExportComponent: React.RefObject<PDFExport>;
    constructor(props: any){
        super(props);
        this.state ={
            isOfficer: this.props.isOfficer
        };
        this.pdfExportComponent = React.createRef();
    }



    componentDidMount() {
        this.setState({})
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.isOfficer !== this.state.isOfficer){
            this.setState({isOfficer: this.props.isOfficer})
        }
    }

    //pdfExportComponent = useRef(null);
    handleExportWithComponent = (event) =>{
        //const pdfExportComponent = useRef(null);
        console.log("click");
        this.pdfExportComponent.current.save();
    };

    createFile(){
        return(
            <div>
                <div style={{width: '100%', backgroundColor: '#004d99', height: '100px'}} className="header">
                <img src="http://4.bp.blogspot.com/-OC-fQgj_P4Q/TWVl6czjOJI/AAAAAAAAAVk/j7yzHTs4Byw/s1600/FortisBC%2Blogo.png" style={{marginLeft: '20%', marginRight: 'auto', width: '50%'}} />
                </div>
                <div>
                <h1 style={{textAlign: 'center'}}>Personal Information Assessment</h1>
                <hr style={{width: '80%', color: 'rgb(255, 230, 7)', borderColor: 'rgb(255, 230, 7)'}} />
                <p style={{textAlign: 'right', marginRight: '10vw'}}> <strong>Date Created:</strong> dd.mm.yyyy</p>
                </div>
                <div style={{width: '90%', marginLeft: '5%'}}>
                <p><b>Project name:</b> 
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum leo nec eg
                    estas luctus. Cras id viverra turpis, auctor bibendum elit. Donec risus enim, laor
                    et sit amet tempor a, bibendum id ante. Vestibulum sollicitudin nibh eget est laor
                    eet dictum. In arcu nisl, sollicitudin vitae purus sed, porta aliquam tortor. Susp
                    endisse vulputate dui id laoreet mattis. Nam mollis nisl ex, quis ultricies neque
                    lacinia ut. Aenean felisnisi, lobortis ut venenatis vitae, luctus at urna. Orci varius
                    natoque penatibus et magnis dudis parturient montes, nascetur ridiculus mus.
                    Sed egestas risus lectus, non ullemcorper arcu vulputate id.
                    Proin vel eros sodales urna porta lacinia eget in lorem. Quisque sollicitudin utqu
                    am tempor posuere. Donec semper nibh nec nulla laoreet efficitur. Ut viverra nis
                    l ut magna dictum volutpat.
                </p>
                <p><b>Sponsoring Business Unit:</b> Sample Sponsor Unit</p>
                <p><b>Is it necessary for the purpose of the project that personal information be collected, used or disclosed?
                    </b>
                    Yes</p>
                <p><b>If yes, what personal information will be collected, used or disclosed?</b>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed interdum leo nec eg
                    estas luctus. Cras id viverra turpis, auctor bibendum elit. Donec risus enim, laore
                    et sit amet tempor a, bibendum id ante. Vestibulum sollicitudin nibh eget est lao
                    reet dictum. In arcu nisl, sollicitudin vitae purus sed, porta aliquam tortor. Susp
                    endisse vulputate dui id laoreet mattis.
                </p>
                </div>
            </div>

        );
    };

    render() {
        return (
            <div>
                <div className='page-body'>
                    {this.props.isOfficer ?
                        <h1>All PIAs</h1>
                        :
                        <h1>Your PIAs</h1>
                    }
                    <Table dataSource={dataSource} columns={this.state.isOfficer ? columnsForOfficer : columns} />
                    <Row>
                        <Link to="/addNew">
                        <Button style={{backgroundColor: "#ffc82c", color: "#173a64", border: "none"}} type="primary">New PIA</Button>
                        </Link>
                    </Row>
                    <Button type={"link"} style={{flex: "1"}} onClick={this.handleExportWithComponent}>download</Button>
                </div>

                <div style={{visibility: "hidden"}}>         
                    <PDFExport ref={this.pdfExportComponent} paperSize="A4" fileName="PIA" title="PIA" author="FortisBC" creator="FortisBC">
                        {this.createFile()}
                    </PDFExport>
                </div>  
            </div>
        );
    }
}
export default PTable;