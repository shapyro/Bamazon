var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

var choice;
var amt;

var connection = mysql.createConnection({
  host     : 'localhost',
  port: '8889',
  user     : 'root',
  password : 'root',
  database : 'bamazon'
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch(){
  inquirer 
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to search',
      choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product'
      ]
    })
    .then(function(answer){
      switch(answer.action){
        case 'View Products for Sale':
          viewProducts();
          break;
        case 'View Low Inventory':
          lowInventory();
          break;
        case 'Add to Inventory':
          addInventory();
          break;
        case 'Add New Product':
          addNewProduct();
          break;
      }
    })

};

function viewProducts(){
  var query = 'SELECT item_id, product_name, price, stock_qty FROM bamazon.products';
  connection.query(query, function(err, res){
    var data = [];
    res.forEach(item => {
      data.push(item);
    });
    console.log('\n')
    console.table(data)
    runSearch();
  })
};


function lowInventory(){
  var query = 'SELECT * FROM bamazon.products WHERE stock_qty < 5';
  connection.query(query, function(err, res){
    var data = [];
    res.forEach(item => {
      data.push(item);
    });
    console.log('\n')
    console.table(data)
    runSearch();
  })
};

function addInventory() {
  inquirer
    .prompt([
    {
      name: "newItem",
      type: "input",
      message: "What stock item would you like to replenish?"
    },
    {
      name: "qtyAdd",
      type: "input",
      message: "What quantity should be added to inventory"
    }
    ])
    .then(function(answer) {
      var updateQuery = `UPDATE bamazon.products SET stock_qty = stock_qty + ${answer.qtyAdd} WHERE ?`
      connection.query(updateQuery,
        {
          product_name: answer.newItem
        },
      function(err, res){
        if (err) throw err;
        console.log(`${answer.qtyAdd} ${answer.newItem}(s) have been added to inventory`)
        runSearch();
      });

    });
  
};


function addNewProduct() {
  var checkQuery = "SELECT distinct(department_name) FROM bamazon.products"
  connection.query(checkQuery, function(err, res){
    var depts = res.map(dep => dep.department_name)
    // console.log(res);
    // console.log(depts)
    inquirer
    .prompt([
    {
      name: "newItem",
      type: "input",
      message: "What new produt would you like to add to Inventory?"
    },
    {
      name: "qtyAdd",
      type: "input",
      message: "What quantity should be added to inventory"
    },
    {
      name: "dep",
      type: "rawlist",
      message: "What departmtent?",
      choices: depts
    },
    {
      name: "amt",
      type: "input",
      message: "What is the selling price for the item?"
    }
    ])
    .then(function(answer) {
      // console.log (`${answer.newItem} | ${answer.qtyAdd} | ${answer.dept} | ${answer.price}`)
      var insertQ = "INSERT INTO bamazon.products SET ?, ?, ?, ?"
      connection.query(insertQ,
        [
          {
            product_name: answer.newItem
          },
          {
            stock_qty: answer.qtyAdd
          },
          {
            department_name: answer.dep
          },
          {
            price: answer.amt
          },
        ],
      function(err, res){
        if (err) throw err;
        console.log(`${answer.qtyAdd} ${answer.newItem}(s) have been added to inventory`)
        runSearch();
      });

    });
  })
  
  
};