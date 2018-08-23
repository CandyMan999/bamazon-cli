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
        message: "Sup Soup! What would you like to do today?",
        choices: ["View Product Sales by Department", "Create New Department" ,"Clock Out"],
        name: "item"
    }).then(({item}) => {
        switch(item){
            case "View Product Sales by Department": 
                departmentSales();
                break;
            case "Create New Department": 
                newDepartment();
                break;
            case "Clock Out":
                console.log("Whoo, what A long day! See ya manana!");
                connection.end(); 
        }
    })           
}

function departmentSales(){
    connection.query("SELECT count(*) as total, departments.department_name, departments.over_head_costs, sum(products.product_sales) as total_sales, (sum(products.product_sales) - departments.over_head_costs) as total_profit FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_id;", function(err, res) {
        if (err){
            console.log(err);
        } 
        else {
            console.log()
                res.forEach(element => {
                    console.log(`For ${element.department_name}: Total Profit is: ${element.total_profit}`);
                });
            console.log("-------------------------")
            console.log()  
            let grossProfit = res.reduce((total, {total_profit}) => total + total_profit, 0);
            console.log("Total Store Profit: " , grossProfit);
            if (grossProfit < 0){
                inquirer.prompt({
                    type: "confirm",
                    message: "We gots no Money, would you like to fire someone?",
                    name: "confirm",
                    default: true,
                }).then(({confirm}) => {
                    if (confirm){
                        console.log("HR fired the Manager!")
                        console.log();
                        selectAction();
                    } else {
                        console.log("HR will give the manager a second chance!")
                        selectAction();
                    }
                })
            } else {
                console.log("Looks like we are in the Money Soup!!")
                console.log();
                selectAction();
            }
        }
    });    
}

function newDepartment(){
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the new department?", 
        name: "department"
    },{
        type: "number",
        message: "What will our overhead be?",
        name: "overhead"
    }]).then(({overhead, department}) => {
        let newRow = {
            over_head_costs: overhead,
            department_name: department,
        }      
        connection.query("INSERT INTO departments SET ?", [newRow], function (err,res) {
            if (err) {
                console.log(err);
            } else {
                console.log();
                console.log(`${department} is gonna do numbers!! You're a god damn genius, you must have an IQ of 180!`);
                console.log();
            }
            selectAction();
        })
    })
}

