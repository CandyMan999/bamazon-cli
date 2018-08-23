var mysql = require("mysql");
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_DB",
  multipleStatements: true
});


connection.connect(function (err) {
  if (err) throw err;
  selectAction();
});

function selectAction(){
    let listChoice = [];
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        else {
            res.forEach(element => {
            listChoice.push(element.item_id +" , "+ element.product_name + " , " + element.department_name +" , $" + element.price);    
            });
            inquirer.prompt([{
                type: "list",
                message: "Which item would you like to purchase?",
                choices: listChoice,
                name: "item"
            },{
                type: "number",
                message: "How many units would you like to buy?",
                name: "units"

            }]).then(function (response) {
                let itemSelectedID = response.item.split(",")[0];
                let ordered = response.units;
                //console.log(itemSelectedID);
                //console.log(ordered);
                fillOrder(itemSelectedID, ordered);
            })
        }
    });
            
}

function fillOrder(itemSelectedID, ordered){
    connection.query("SELECT * FROM products WHERE item_id = ?",[itemSelectedID], function(err, res) {
        if (err) throw err;
        console.log(ordered);
        let quantity = res[0].stock_quantity; 
        let price = res[0].price*ordered;
        let currentSales = res[0].product_sales;
        if (ordered > quantity) {
            console.log("Sorry, we only have " + quantity + " in stock!");
            inquirer.prompt({
                type: "number",
                message: "How many units would you like to buy?",
                name: "units"
            }).then(function (response) {
                let ordered = response.units;
                //console.log(itemSelectedID);
                //console.log(ordered);
                fillOrder(itemSelectedID, ordered);    
            })
        } else {
            inquirer.prompt([{
                type: "confirm",
                message: "Total cost for this purchase is $" + price + ", proceed?", 
                name: "confirmChoice",
                default: true
            }]).then(function (response) {
                currentSales += price;   
                let confirmChoice = response.confirmChoice;
                if (confirmChoice){
                    quantity -= ordered;
                    var query = 'UPDATE products SET stock_quantity=?, product_sales=? WHERE item_id=?';
                    connection.query(query,[quantity, currentSales, itemSelectedID],function (err, result, rows, fields){
                        if (err) throw err;
                        console.log("Your " + res[0].product_name, "order should arrive in 2-3 months!");
                        console.log();
                        selectAction();
                    }) 
                } else {
                    console.log("No worries, let's start over");
                    selectAction();
                }
                

            }) 
        } 
           
    });    

}

