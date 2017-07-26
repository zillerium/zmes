import React, { Component } from 'react';
import './App.css';
//import Web3 from 'web3'
import _ from 'lodash'
import {Navbar, Jumbotron, Button, Nav, NavItem, NavDropdown,
  MenuItem, FormGroup, FormControl} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

var Link = require('react-router-dom').Link

var selectRowProp= {
  mode: "checkbox",
  clickToSelect: true
}

class ProductTable extends React.Component {
  constructor(props) {
    super(props);



    //this.props.getSelectedRowKeys = this.props.getSelectedRowKeys.bind(this.props)


  }

  imageFormatter(cell, row) {
    return (<img style={{width:50}} src={cell}/>)
  }




  multilinecell (cell, row) {
    return "<textarea readonly class='form-control cell' rows='3'>"+ cell + "</textarea>";
  }

render() {
    var tableHtml =
    <div>
     <button onClick={this.props.getSelectedRowKeys}>Buy</button>
    <button><Link  to={'/about'}>Link</Link></button>
    <BootstrapTable data={this.props.products}  selectRow={this.selectRowProp} ref='table'
    striped={true} hover={true}>
     <TableHeaderColumn      dataField="imageurl"  width='200px' dataAlign="center"
     dataFormat={this.imageFormatter}>Image</TableHeaderColumn>
     <TableHeaderColumn   width='200px'   dataField="partnumber" isKey={true} dataAlign="center"
     dataSort={true}>Part Number</TableHeaderColumn>
     <TableHeaderColumn   dataField="partdesc" dataFormat={this.multilinecell}  dataAlign="center"
     dataSort={true}>Desc</TableHeaderColumn>
     <TableHeaderColumn   dataField="partman" width='200px'  dataAlign="center"
     dataSort={true}>Manufacturer</TableHeaderColumn>
    </BootstrapTable>
    </div>
return ( <div>
    {tableHtml}
    </div>
  )
  }

}

export default ProductTable;
