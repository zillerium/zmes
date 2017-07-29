import React, { Component } from 'react';
import './App.css';
//import Web3 from 'web3'
import _ from 'lodash'
import {Navbar, Jumbotron, Button, Nav, NavItem, NavDropdown,
  MenuItem, FormGroup, FormControl} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn, InsertButton} from 'react-bootstrap-table';

var Link = require('react-router-dom').Link

var selectRowProp= {
  mode: "checkbox",
  clickToSelect: true
}

class BuyTable extends React.Component {
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

  componentDidMount(newProps) {
//    this.setState({stateRefs: this.refs});
    this.props.updateStateRefs(this.refs)
    console.log("props": props)
    console.log("newprops": newProps)
  }

    //options = {{ onRowClick: this.props.clickRow } }

  //   <TableHeaderColumn
  //    dataField = "comparePrices"
//      dataAlign="center"
//      dataSort = { true }
//      dataFormat={this.props.buttonFormatter}> Sellers
//    </TableHeaderColumn>

//...
//<BootstrapTable data={rows} options={options} insertRow>

render() {
//  const options = {
//    insertBtn: this.props.createCustomInsertButton
//  };
//   striped={true} hover={true} options = {options} insertRow>
//    <TableHeaderColumn   dataField="partman" width='200px'  dataAlign="center" dataFormat={this.props.LinkFormatter}>
  var selectRowProp = {
    mode: "checkbox",
      clickToSelect: true
  }
  const options = {
     expandRowBgColor: 'rgb(242, 255, 163)',
    onExpand: this.props.handleExpand
   };
    var tableHtml =
    <div>
     <button onClick={this.props.buygetSelectedRowKeys}>Buy</button>
    <button><Link  to={'/about'}>Link</Link></button>
    <BootstrapTable data={this.props.products}
     ref={this.props.setTable}
     options = { options }
     expandableRow={ this.props.isExpandableRow }
        expandColumnOptions={ { expandColumnVisible: true } }
       expandComponent={ this.props.expandComponent }
    striped={true} hover={true}  >
     <TableHeaderColumn      dataField="imageurl"  width='200px' dataAlign="center"
     dataFormat={this.props.imageFormatter}>Image</TableHeaderColumn>
     <TableHeaderColumn   width='200px'   dataField="partkey"  isKey={ true  }  dataAlign="center"
     dataSort={true}>Product</TableHeaderColumn>
     <TableHeaderColumn   width='200px'   dataField="partnumber"  dataAlign="center"
     dataSort={true}>Part Number</TableHeaderColumn>
     <TableHeaderColumn   dataField="partdesc" dataFormat={this.props.multilinecell}  dataAlign="center"
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

export default BuyTable;
