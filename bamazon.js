var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

var connection = mysql.createConnection({
  host     : 'localhost',
  port: '8889',
  user     : 'root',
  password : 'root',
  database : 'bamazon'
});

connection.connect(function(err) {
  if (err) throw err;

  query = 'SELECT * FROM bamazon.products';
  connection.query(query, function(err, res){
    res.forEach(item => {
      console.table([
        {
          product: item.product_name,
          department: item.department_name,
          price: item.price,
          inventory: item.stock_qty
        }
      ]);
    });
    shop();
  })
  // run the start function after the connection is made to prompt the user
  
});

function shop() {
  // do some other stuff
  connection.query("SELECT * FROM bamazon.products", function(err, res){
  if (err) throw err;

  inquirer
    .prompt({
      name: "pick",
      type: "input",
      message: "Would you like to buy?",
    })
    .then(function(answer) {
      var chosenItemArray = res.filter(item => item.product_name === answer.pick);
      var chosenItem = chosenItemArray[0];
      // console.log(chosenItemArray)
      console.log('chosen: ' + chosenItem.product_name)
      console.log('answer: ' + answer.pick)
      // if (res.i)
    });
  });
}