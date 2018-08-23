DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price INT NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);


CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(30) NOT NULL,
  over_head_costs INT NOT NULL DEFAULT 0,
  PRIMARY KEY (department_id)
);


INSERT INTO departments (department_name, over_head_costs)
VALUES ("electronics", 2500);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("home", 3000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("appliances", 3500);

INSERT INTO departments (product_name, department_name, price, stock_quantity)
VALUES ("coffee maker", "appliances", 85.50, 200);

INSERT INTO departments (product_name, department_name, price, stock_quantity)
VALUES ("t.v.", "electronics", 999, 35);

INSERT INTO departments (product_name, department_name, price, stock_quantity)
VALUES ("area rug", "home", 800, 25);

INSERT INTO departments (product_name, department_name, price, stock_quantity)
VALUES ("lamp", "home", 150, 85);

INSERT INTO departments (product_name, department_name, price, stock_quantity)
VALUES ("blender", "appliances", 130, 15);

INSERT INTO departments (product_name, department_name, price, stock_quantity)
VALUES ("radio", "electronics", 550, 100);

INSERT INTO departments (product_name, department_name, price, stock_quantity)
VALUES ("toaster", "appliances", 25, 40);

INSERT INTO departments (product_name, department_name, price, stock_quantity)
VALUES ("curtains", "home", 350, 60);

INSERT INTO departments (product_name, department_name, price, stock_quantity)
VALUES ("rice cooker", "appliances", 70, 45);