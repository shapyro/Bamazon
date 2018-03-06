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
      message: 'Bamazon super search',
      choices: [
        'View Product Sales by Department',
        'Create New Department'
      ]
    })
    .then(function(answer){
      switch(answer.action){
        case 'View Product Sales by Department':
          viewProductSales();
          break;
        case 'Create New Department':
          createDept();
          break;
      }
    })

};



function viewProductSales(){
  var query = 'SELECT department_name FROM bamazon.department';
  connection.query(query, function(err, res){
    var data = [];
    res.forEach(item => {
      data.push(item);
      // console.log(data)
    });
    console.log('\n')
    console.log(data.length)
    var num = data.length
    // console.table(data)
    var dataRes = []
    for (i=0; i<data.length; i++) {
      var superQuery = `SELECT department_id, dept.department_name, over_head_costs, sum(product_sales) as product_sales
      FROM bamazon.products prods
      INNER JOIN bamazon.department dept
      ON prods.department_name = dept.department_name
      where dept.department_id = ${i}`
      // console.log(i)
      connection.query(superQuery, function(error, results){
        console.log(results)
        //dataRes.push(results[i].department.id, results[i].department_name, results[i].overhead_costs, results[i].product_sales);
        // console.log(results[i])
      }) 
    };
    console.table(dataRes)
    runSearch();
  })
};
