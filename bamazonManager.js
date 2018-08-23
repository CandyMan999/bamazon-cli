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
  database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    selectAction();

});


function selectAction(){
    inquirer.prompt({
        type: "list",
        message: "Good Morning Manager, what task shall you preform?",
        choices: ["View Products for Sale" ,"View Low Inventory","Add to Inventory","Add New Product" , "Clock Out"],
        name: "action"
    }).then(function (response) {
        switch(response.action){
            case "View Products for Sale": 
                viewProducts();
                break;
            case "View Low Inventory": 
                viewLowInventory();
                break;
            case "Add to Inventory": 
                addInventory();
                break;  
            case "Add New Product": 
                getList();
                break;   
            case "Clock Out":
                console.log("Shitake Mushrooms, You're leaving, ok.. bye bye!");
                connection.end(); 
        }
    })           
}


function renderItem(item){
    console.log("ID#: "+ item.item_id +"  "+ item.product_name + ", $" + item.price + ", quantity: " + item.stock_quantity);
}

function renderItems(err, res){
    if (err) throw err;
    res.forEach(renderItem);
}
 
function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        else {
            console.log();
            res.forEach(renderItem);
            console.log();
            selectAction();
        }
    })
}

function viewLowInventory(){
    
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",  function(err, res){
        if (res.length >= 1){
        console.log();
        console.log("These need to be filled boss");
        console.log();
        renderItems(err,res)   
        console.log();
        inquirer.prompt([{
            type: "confirm",
            message: "Would you like to restock any of these items now?", 
            name: "confirmChoice",
            default: true
        }]).then(function (response) {
            if(response.confirmChoice){
                addInventory();
            } else {
                selectAction();
            }
        })
        } else {
        console.log();
        console.log("Seems all our inventory is stocked up boss!");
        console.log();
        selectAction();
        }
    })
   
}

function addInventory(){
    let listChoice = [];
    let quantity;
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",  function(err, res){
    if (err) throw err;
        else {
            res.forEach(element => {
            listChoice.push(element.item_id +" , "+ element.product_name+" , $" + element.price + ", in stock: " + element.stock_quantity );  
            quantity = element.stock_quantity  
            });
            if (listChoice.length === 0){
                console.log("Seems we are good on our inventory boss!");
                console.log();
                selectAction();
            } else {
                inquirer.prompt([{
                    type: "list",
                    message: "Which item would you like to restock?",
                    choices: listChoice,
                    name: "item"
                },{
                    type: "number",
                    message: "How many units would you like to order?",
                    name: "units"

                }]).then(function (response) {
                
                    let id = response.item.split(",")[0];
                    quantity += response.units;
                    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [quantity , id], function(err, res) {
                        console.log();
                        console.log("Good job manager, you have replenished " +res.affectedRows + " item!");
                        console.log();
                        if (listChoice.length >= 2){
                            inquirer.prompt([{
                                type: "confirm",
                                message: "Would you like to restock your other low inventory items?", 
                                name: "confirmChoice",
                                default: true
                            }]).then(function (response) {
                                if(response.confirmChoice){
                                    addInventory();
                                } else {
                                    selectAction();
                                }
                            })
                        
                        }
                    }) 
                })
            } 
        }       
    })
}

function getList(){
    
    let departList = [];
    connection.query("SELECT * FROM departments", function(err, res) {
        if (err){
            console.log(err);
        } else {
        
            res.forEach(element => {
                if(departList.indexOf(element.department_name) === -1){
                    departList.push(element.department_name);
                }         
            });
            addProduct(departList);
        }
        
    })
}

function addProduct(departList){ 
    
    inquirer.prompt([{
        type: "list",
        message: "What department will we carry our new item?", 
        choices: departList,
        name: "department"
    },{
        type: "input",
        message: "What is the name of the new item?",
        name: "name"
    },{
        type: "number",
        message: "What is the price for the new item?",
        name: "price"
    },{
        type: "number",
        message: "How many of this product would you like to order?",
        name: "order"

    }]).then(function (response) {
        let department = response.department;
        let name = response.name;
        let price = response.price;
        let order = response.order;
        let newRow = {
            product_name: name,
            department_name: department,
            price: price,
            stock_quantity: order
        }
        connection.query("INSERT INTO products SET ?", [newRow], function (err,res) {
            if (err) {
            console.log("Error: ", err);
            connection.end();
            } else {
                console.log("You are such a smart Manager, " + name + "s will sell like hotcakes!");
                console.log();
                selectAction();
            }
        })
    })    
           
}

