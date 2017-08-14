import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import Web3 from 'web3'
import _ from 'lodash'
import {Navbar, Jumbotron, Button, Nav, NavItem, NavDropdown,
  MenuItem, FormGroup, FormControl} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn,  InsertButton} from 'react-bootstrap-table';
import {Redirect} from 'react-router-dom';
import elasticsearch from 'elasticsearch'
import ProductTable from './ProductTable.js'
import BuyTable from './BuyTable.js'
import BSTable from './BSTable.js'
//import { Router, Route, Switch } from 'react-router'
//import { BrowserRouter, Route, Link } from 'react-router-dom'

var BrowserRouter = require('react-router-dom').BrowserRouter
var Route = require('react-router-dom').Route
var Link = require('react-router-dom').Link
var web3 = require('web3');

var axios = require('axios')
//var elasticsearch = require('elasticsearch')


var selectRowProp= {
  mode: "checkbox",
  clickToSelect: true
}

//   host: 'toganic.com:9200/product',

const esClient = new elasticsearch.Client({
  host: 'toganic.com:9200',
  log: 'error'
})

const esSellerClient = new elasticsearch.Client({
  host: 'toganic.com:9200/seller',
  log: 'error'
})

var globalSellerListing = [];

class App extends Component {

  constructor(props) {
    super(props);
       this.state = { contractJson:[], switchVal: 0, stateProductsToBuy: [],
         stateProducts: [],
         expandedRow: 0, zilleriumRowkey: 's', testState: 2, stateSellers: [],
         stateProductKeys: [], stateRefs: '', results:[], IPFSContract:'', IPFSText: '--', sellerProducts: [], stateSellerListing: [],
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
    this.createCustomInsertButton=this.createCustomInsertButton.bind(this)
    this.LinkFormatter=this.LinkFormatter.bind(this)
    this.expandComponent=this.expandComponent.bind(this)
    this.isExpandableRow=this.isExpandableRow.bind(this)
    this.getSellerData=this.getSellerData.bind(this)
    this.handleExpand=this.handleExpand.bind(this)
    //this.selectRowProp = this.selectRowProp.bind(this)
  }

Login() {
  var username = this.inputUserName.value;
  var password = this.inputPassword.value;
  console.log("username = ", username)
  console.log("pwd = ", password)

}

isExpandableRow(row) {
  return true;
}

LinkFormatter (cell, row) {
  var url = "http://merrows.co.uk"
  var link = "<a href="+cell+">"+row.sellername+"</a>";
  return link;
}

multilinecell (cell, row) {
  return "<textarea readonly class='form-control cell' rows='3'>"+ cell + "</textarea>";
}

expandComponent(row) {
  console.log("expand")

  console.log("expand row action")
  var i=9;
 var sellers = ''
 if (this.state.expandedRow==1) {
     this.findSellers(this.state.zilleriumRowkey)
     sellers = this.state.stateSellers;


  //  sellers = this.state.stateSellerListing;
 }

  return (
    <BSTable
    data={sellers}
    LinkFormatter={this.LinkFormatter}
    />

)
}

findSellersFromState(partkeyUI) {
  //stateProductsToBuy;
  var allSellers=[];

   var setTable = "table"
   for (const productDetail of this.state.stateProductsToBuy) {
        const partkey = productDetail._source.partkey;
        if (partkey==partkeyUI) {
          var sellers = productDetail.sellers;
          allSellers.push({
            'partnumber':   sellers.partnumber,
            'imageurl': sellers.imageurl,
            'partdesc': sellers.partdesc,
            'partman': sellers.partman,
            'partkey': sellers.partman.toLowerCase() +  sellers.partnumber
          });
        }
      }

return allSellers;

}

handleExpand(rowKey, isExpand) {
  if (isExpand) {
    console.log(`row: ${rowKey} is ready to expand`);
    this.setState({zilleriumRowkey: rowKey});
        this.setState({expandedRow: 1});

  } else {
    console.log(`row: ${rowKey} is ready to collapse`);
    this.setState({zilleriumRowkey: ''});
        this.setState({expandedRow: 0});
  }
}



findSellersDSL ( partkey) {



//  const search_query = event.target.value
console.log("this - ", this)
console.log("get seller data")
var sellers=[];
esClient.search({
  index: 'seller',
  body: {
    "from" : 0, "size" : 20,
    "query" : {
        "term" : { "partkey" : partkey }
    }
  }
}, (error, response) => {
    console.log("error ", error)
    console.log("response ", response)
      if (typeof error != 'undefined') {
        // process error
      }  else {
        // process response
        console.log ("process response")
        let responseData = response.hits.hits;
        console.log("response data - ", responseData)
         sellers = this.updateSellerArrays(responseData);
      }

    // ...
});
return sellers;
}

findSellers ( partkey) {

  const query = {
    body: {
      "from" : 0, "size" : 20,
      "query" : {
          "term" : { "partkey" : partkey }
      }
    }
  };

  const query2 = {
      "query" : {
          "term" : { "partkey" : partkey }
      }
  };

//  const search_query = event.target.value
console.log("this - ", this)
console.log("get seller data")
var sellers=[];
var q= JSON.stringify(query2)
console.log(q)
axios.get('http://toganic.com:9200/seller/company/_search', {
  params: {
    source: q,
    source_content_type: 'application/json'
  }
}).then((response) => {
  console.log(response);
  let responseData = response.data.hits.hits;
  console.log("response data - ", responseData)
   sellers = this.updateSellerArrays(responseData);
   this.setState({stateSellers:sellers});
});


//return sellers;
}



handleChange (  ) {
//  const search_query = event.target.value
console.log("this - ", this)
console.log("get product data")
this.setState({switchVal:0});
  var searchQ = this.searchParm.value;
var search_queryES="partdesc:" + searchQ + "*"

const searchTerm = `${searchQ}*`;
esClient.search({
  index: 'product',
  body: {
    "from" : 0, "size" : 10,
    "query" : {
        "wildcard" : { "partdesc" : searchTerm }
    }
  }
}, (error, response) => {
    console.log("error ", error)
    console.log("response ", response)
      if (typeof error != 'undefined') {
        // process error
      }  else {
        // process response
        console.log ("process response")
        let responseData = response.hits.hits;
        console.log("response data - ", responseData)
        this.updateProductArrays(responseData);
      }


    // ...
});



}

handleInsertButtonClick = (onClick) => {
  // Custom your onClick event here,
  // it's not necessary to implement this function if you have no any process before onClick
  console.log('This is my custom function for InserButton click event');
  onClick();
}

createCustomInsertButton = (onClick) => {
  return (
    <InsertButton
      btnText='CustomInsertText'
      btnContextual='btn-warning'
      className='my-custom-class'
      btnGlyphicon='glyphicon-edit'
      onClick={ () => this.handleInsertButtonClick(onClick) }/>
  );
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

getSellerData(productRecord){
  var sellerProducts=[];
console.log("get seller data")
  var productsLocal = [];

    var partman = productRecord.partman;
    var imageurl = productRecord.imageurl;
    var partdesc = productRecord.partdesc;
    var partnumber = productRecord.partnumber;
    var partkey = productRecord.partkey;
    sellerProducts = this.findSellers(partkey);
    productsLocal.push({
    'partnumber':   partnumber,
    'imageurl': imageurl,
    'partdesc': partdesc,
    'partman': partman,
    'partkey': partkey,
    'sellers': sellerProducts
  });


  return productsLocal[0];
//  this.setState({stateProducts: productsLocal});

}
handleOnSelect(row, isSelected) {
console.log("88888888888888 rows selected")
  var i=1;
}

getSelectedRowKeys = () => {
  // this.refs.table
  console.log("buying action")
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
      //  var y = this.getSellerData(x)
      //  productsToBuy[i]=y;
        var u=1;
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

componentWillMount() {

//  this.updateProductArrays()
}

updateSellerArrays=(sellerEsProducts)=>{

console.log("create product state data")

var sellerProductsLocal=[];
  for (var i = 0; i < sellerEsProducts.length; i++) {
     var sellerDetails =  sellerEsProducts[i];
     var sellerurl = sellerDetails._source.sellerurl;
     var sellername = sellerDetails._source.sellername;
     var partnumber = sellerDetails._source.partnumber;
     var partman = sellerDetails._source.partman;
   var partprice = sellerDetails._source.partprice;

        sellerProductsLocal.push({
        'sellerurl':   sellerurl,
        'sellername': sellername,
        'partnumber': partnumber,
        'partman': partman,
        'partprice': partprice,
        'partkey': partman.toLowerCase() +  partnumber
      });
      }

//this.setState({sellerProducts: sellerProductsLocal}) // these are async updates hence local vars are used
return sellerProductsLocal;
//this.setState({stateSellers: sellerProductsLocal})
}


updateProductArrays=(returnedProducts)=>{
  var products=[];
  var productkeys=[];

   var setTable = "table"


      for (const customerName of returnedProducts) {
        const partdesc = customerName._source.partdesc;
        const partnumber = customerName._source.partnumber;
        const partman = customerName._source.partman;
        const imageurl = customerName._source.imageurl;
        productkeys.push({
          'partnumber': partnumber
        })
        products.push({
        'partnumber':   partnumber,
        'imageurl': imageurl,
        'partdesc': partdesc,
        'partman': partman,
        'partkey': partman.toLowerCase() +  partnumber
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
          buttonFormatter={this.buttonFormatter}
           multilinecell={this.multilinecell}
           updateStateRefs={this.updateStateRefs}
           selectRowProp={setSelectRowProp}
           createCustomInsertButton={this.createCustomInsertButton}
           expandComponent={this.expandComponent}
           LinkFormatter={this.LinkFormatter}
           isExpandableRow={this.isExpandableRow}
           setTable={setTable}
           handleExpand={this.handleExpand}
           handleOnSelect={this.handleOnSelect}
           sellerProducts={this.sellerProducts}
        //   clickRow={this.clickRow}
          buygetSelectedRowKeys={this.buygetSelectedRowKeys}
           />
         </div>
       }

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
