var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

var choice;

var connection = mysql.createConnection({
  host     : 'localhost',
  port: '8889',
  user     : 'root',
  password : 'root',
  database : 'bamazon'
});

connection.connect(function(err) {
  if (err) throw err;

  query = 'SELECT item_id, product_name, price FROM bamazon.products';
  connection.query(query, function(err, res){
    var data = [];
    res.forEach(item => {
      data.push(item);
    });
    console.log('\n')
    console.table(data)
    pick();
  })
  
});

function pick() {
  connection.query("SELECT * FROM bamazon.products", function(err, res){
  if (err) throw err;

  inquirer
    .prompt({
      name: "pick",
      type: "input",
      message: "What would you like to buy?",
    })
    .then(function(answer) {
      var chosenItemArray = res.filter(item => item.product_name === answer.pick);
      var chosenItem = chosenItemArray[0];
      choice = chosenItem.product_name;
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
        var purchaseTotal = answer.qty * res[0].price;
        if (res[0].stock_qty < parseInt(answer.qty)) {
          console.log(`we only have ${res[0].stock_qty} left in stock`)
        } else {
          console.log('processing purchase')
          var diff = res[0].stock_qty - answer.qty;
          var updateQuery = 'UPDATE bamazon.products SET ?, ? + product_sales WHERE ?'
          connection.query(updateQuery, 
            [
              {
                stock_qty: diff
              },
              {
                product_sales: purchaseTotal
              },
              {
                product_name: choice
              },

            ],
            function(err){
              if (err) throw err;
              console.log("purchase complete")
              console.log(`That will be $${purchaseTotal} please`);
            }
          );
        }
        pick();
      });
  })

}