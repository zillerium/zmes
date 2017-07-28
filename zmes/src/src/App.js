import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import Web3 from 'web3'
import _ from 'lodash'
import {Navbar, Jumbotron, Button, Nav, NavItem, NavDropdown,
  MenuItem, FormGroup, FormControl} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {Redirect} from 'react-router-dom';
import elasticsearch from 'elasticsearch'
import ProductTable from './ProductTable.js'
import BuyTable from './BuyTable.js'
//import { Router, Route, Switch } from 'react-router'
//import { BrowserRouter, Route, Link } from 'react-router-dom'

var BrowserRouter = require('react-router-dom').BrowserRouter
var Route = require('react-router-dom').Route
var Link = require('react-router-dom').Link
var web3 = require('web3');
//var elasticsearch = require('elasticsearch')


var selectRowProp= {
  mode: "checkbox",
  clickToSelect: true
}

const esClient = new elasticsearch.Client({
  host: 'toganic.com:9200/product',
  log: 'error'
})

class App extends Component {

  constructor(props) {
    super(props);
       this.state = { contractJson:[], switchVal: 0,stateProductsToBuy: [], stateProducts: [], stateProductKeys: [], stateRefs: '', results:[], IPFSContract:'', IPFSText: '--',
      ETHEREUM_CLIENT: 'a', switchVal:0, UserMessage: [],
      contractAddress: '0x8d3e374e9dfcf7062fe8fc5bd5476b939a99b3ed',
      ZsendAddress:'0xd73e172751e751d274037cb1f668eb637df55e33',ZsendContract:''}

    this.Login = this.Login.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.imageFormatter = this.imageFormatter.bind(this)
    this.buttonFormatter = this.buttonFormatter.bind(this)
    this.multilinecell = this.multilinecell.bind(this)
    this.getSelectedRowKeys = this.getSelectedRowKeys.bind(this)
    this.updateProductArrays = this.updateProductArrays.bind(this)
    this.buygetSelectedRowKeys = this.buygetSelectedRowKeys.bind(this)
    this.clickRow = this.clickRow.bind(this)
    //this.selectRowProp = this.selectRowProp.bind(this)
  }

Login() {
  var username = this.inputUserName.value;
  var password = this.inputPassword.value;
  console.log("username = ", username)
  console.log("pwd = ", password)

}

multilinecell (cell, row) {
  return "<textarea readonly class='form-control cell' rows='3'>"+ cell + "</textarea>";
}

handleChange (  ) {
//  const search_query = event.target.value
console.log("this - ", this)
this.setState({switchVal:0});
  var searchQ = this.searchParm.value;
var search_queryES="partdesc:" + searchQ + "*"
/*  esClient.search({
    q: search_queryES
  }).then(function ( body ) {
    this.setState({
      results: body.hits.hits
    })
    console.log(this.state.results)
    this.updateProductArrays();
  }.bind(this), function ( error ) {
    console.trace( error.message );
  });
*/
  esClient.search({
    q: search_queryES
  }).then(body => {
    this.setState({
      results: body.hits.hits
    })
    console.log(this.state.results)
    this.updateProductArrays();
  }, error => {
    console.trace( error.message );
  });

}




imageFormatter(cell, row) {
  return (<img style={{width:50}} src={cell}/>)
}
buttonFormatter(cell, row) {
  return (<BootstrapTable type="submit"></BootstrapTable>)
}

buygetSelectedRowKeys() {
  console.log('selected buy option')
}

handleClick = () => {
  console.log('clickity');
}

// https://daveceddia.com/avoid-bind-when-passing-props/

updateStateRefs = (stateRefsParm) => {
  this.setState({stateRefs: stateRefsParm })
}

clickRow = () => {
  //var c= this.state.stateRefs.table.state.selectedRowKeys;
  console.log("clicked on row")
}

getSelectedRowKeys = () => {
  // this.refs.table
  var c= this.state.stateRefs.table.state.selectedRowKeys;
  var productsToBuy = [];


  console.log(this.state.stateRefs.table.state.selectedRowKeys);
  this.setState({switchVal: 1}); // used to decide on rendering - possible bad practice solution

    for (var i = 0; i < c.length; i++) {
    //  var j =  this.state.stateProductKeys.parttnumber.indexOf(c[i])
  //    productsToBuy[i]=this.state.stateProducts[j];
      let {indexValue} = this.findElement(c[i])
      if (indexValue >-1) {
        var x=this.state.stateProducts[indexValue];
        productsToBuy[i]=x;
      }
    }
      this.setState({stateProductsToBuy: productsToBuy});
      var t=1;
  //<Redirect to="/about"/>
  //render() { return <Link to={'/about'} />; }
}

findElement=(searchString)=>{
  // fix - upgrade to ES6 findindex solution - these failed previously
    var found=-1;
    for (var i = 0; i < this.state.stateProductKeys.length; i++) {
      if (this.state.stateProductKeys[i].partnumber==searchString)
      {
        found =i;
      }
    }
    return {indexValue: found}
}


//  <TableHeaderColumn dataField="button"   dataAlign="center"
//  dataFormat={this.buttonFormatter}>Buy</TableHeaderColumn>

    //                "imageurl": "34215000",
    //                "partdesc": "3-Hole basin mixer installation with star handles, escutcheons with short spout, wall mounted spout 166 mm long normal spray flow rate: 5 l/min operating pressure: min. 1 bar / max. 10 bar flush grated waste - water flow cannot be stopped ",
    ///                "partnumber": "34215000",
    //                "partman": "Grohe"
componentWillMount() {

  this.updateProductArrays()
}

updateProductArrays=()=>{
  var products=[];
  var productkeys=[];

   var setTable = "table"
  for (var i = 0; i < this.state.results.length; i++) {
     var customerName =  this.state.results[i];
     var partdesc = customerName._source.partdesc;
     var partnumber = customerName._source.partnumber;
     var partman = customerName._source.partman;
     var imageurl = customerName._source.imageurl;
     var mynewname = 'trevor oakley data field';
     var myimageurl = 'https://s14.postimg.org/c3w0pd569/groheimage.jpg'
     productkeys.push({
       'partnumber': partnumber
     })
        products.push({
        'partnumber':   partnumber,
        'imageurl': imageurl,
        'partdesc': partdesc,
        'partman': partman
      });
      }
this.setState({stateProducts: products}) // these are async updates hence local vars are used
this.setState({stateProductKeys: productkeys})
}

  render() {
    var setTable = 'table';
       var setSelectRowProp ={ mode: "checkbox",  clickToSelect: true}
       var tableHtml=''
       if (this.state.switchVal==0) {
          tableHtml =<div>
           <ProductTable
           products={this.state.stateProducts}
           imageFormatter={this.imageFormatter}
           multilinecell={this.multilinecell}
           updateStateRefs={this.updateStateRefs}
           selectRowProp={setSelectRowProp}
           setTable={setTable}
          getSelectedRowKeys={this.getSelectedRowKeys}
           />
         </div>
       }

       if (this.state.switchVal==1) {
          tableHtml =<div>
           <BuyTable
           products={this.state.stateProductsToBuy}
           imageFormatter={this.imageFormatter}
      //     buttonFormatter={this.buttonFormatter}
           multilinecell={this.multilinecell}
           updateStateRefs={this.updateStateRefs}
           selectRowProp={setSelectRowProp}
           setTable={setTable}
        //   clickRow={this.clickRow}
          buygetSelectedRowKeys={this.buygetSelectedRowKeys}
           />
         </div>
       }
/*
       var tableHtml3 =
       <div>
       <button onClick={this.getSelectedRowKeys}>Buy</button>
       <button><Link  to={'/about'}>Link</Link></button>
    <BootstrapTable data={this.state.stateProducts} selectRow={selectRowProp  } ref='table'
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

      var buyTableHtml =
      <div>
      <button onClick={this.buygetSelectedRowKeys.bind(this)}>Confirm</button>
   <BootstrapTable data={this.state.stateProductsToBuy} selectRow={selectRowProp} ref='buytable'
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
     */
    const navbarInstance = (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">Zillerium</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="#">Link</NavItem>
      <NavItem eventKey={2} href="#">Link</NavItem>
      <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
        <MenuItem eventKey={3.1}>Action</MenuItem>
        <MenuItem eventKey={3.2}>Another action</MenuItem>
        <MenuItem eventKey={3.3}>Something else here</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey={3.4}>Separated link</MenuItem>
      </NavDropdown>
    </Nav>
    <Navbar.Collapse>
   <Navbar.Form pullLeft>
     <FormGroup>
       <FormControl inputRef={(input) =>  this.searchParm = input}
       type="text" placeholder="Search" />
     </FormGroup>
     {' '}

     <Button type="submit" onClick={() => this.handleChange()}>Search</Button>

   </Navbar.Form>

<Navbar.Form pullRight>
  <FormGroup>
    <FormControl inputRef={(input) =>  this.inputUserName = input}
    type="text" placeholder="User Name" />
    <FormControl inputRef={(input) =>  this.inputPassword = input}
     type="text" placeholder="Password" />
  </FormGroup>
  {' '}
  <Button type="submit" onClick={() => this.Login()}>Login</Button>
</Navbar.Form>
</Navbar.Collapse>
  </Navbar>
);

var buyHTML = ''
if (this.state.switchVal==1) {
buyHTML=
<div  >
  {navbarInstance}
  <div><h1>Selected Products</h1></div>
  <div>
    {tableHtml}
  </div>
  <div>

  </div>
</div>
}

if (this.state.switchVal==0) buyHTML = '';


var routeTable=''
var aboutHTML=''
if (this.state.switchVal==0) {
  routeTable=<Route path="/table" render={ () => (
    <div  >
      {navbarInstance}
      <div>
        {tableHtml}
      </div>
    </div>
  )} />
  aboutHTML = <Route  path="/about" render={ () => (
    <div  >
      {navbarInstance}
      <div>
        <h1>About Us</h1>
        {this.state.stateProductsToBuy}

      </div>
    </div>
  )} />
}
    return (
      <div>

      <BrowserRouter>
  <div>
{buyHTML}
  {routeTable}
  {aboutHTML}


</div>
      </BrowserRouter>
</div>
    );
  }
}

export default App;
