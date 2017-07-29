import React, { Component } from 'react';
import './App.css';
//import Web3 from 'web3'
import _ from 'lodash'
import {Navbar, Jumbotron, Button, Nav, NavItem, NavDropdown,
  MenuItem, FormGroup, FormControl} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn, InsertButton} from 'react-bootstrap-table';

class BSTable extends React.Component {
  render() {
    if (this.props.data) {
      return (
        <BootstrapTable data={ this.props.data }>
          <TableHeaderColumn dataField='partkey' isKey={ true  }   >Product</TableHeaderColumn>
          <TableHeaderColumn dataField='sellerurl'    dataFormat={this.props.LinkFormatter}>Link</TableHeaderColumn>
          <TableHeaderColumn dataField='sellername'>Seller</TableHeaderColumn>
          <TableHeaderColumn dataField='partnumber'>PartNumber</TableHeaderColumn>
          <TableHeaderColumn dataField='partman'>Manufacturer</TableHeaderColumn>
          <TableHeaderColumn dataField='partprice'>Price</TableHeaderColumn>
        </BootstrapTable>);
    } else {
      return (<p>?</p>);
    }
  }
}


export default BSTable
