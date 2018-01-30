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
    pick();
  })
  
});

function pick() {
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
      choice = chosenItem.product_name;
      amt = chosenItem.price;
      // console.log(chosenItemArray)
      console.log('chosen: ' + chosenItem.product_name)
      console.log('answer: ' + answer.pick)
      // if (res.i)
      shop();
    });

  });
  
}

function shop() {
  connection.query('SELECT * FROM bamazon.products WHERE ?',  
  {
    product_name: choice
  },
  function(err, res){
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'qty',
          type: 'input',
          message: `How many items would you like to purchase?`
        }
      ])
      .then(function(answer) {
        if (res[0].stock_qty < parseInt(answer.qty)) {
          console.log(`we only have ${res[0].stock_qty} left in stock`)
        } else {
          console.log('processing purchase')
          var diff = res[0].stock_qty - answer.qty;
          var updateQuery = 'UPDATE bamazon.products SET ? WHERE ?'
          connection.query(updateQuery, 
            [
              {
                stock_qty: diff
              },
              {
                product_name: choice
              }
            ],
            function(err){
              if (err) throw err;
              console.log("purchase complete")
              console.log(`that will be $${amt} please`);
            }
          );
        }
      })
  })

}