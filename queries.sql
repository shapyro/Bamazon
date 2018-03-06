CREATE DATABASE bamazon

CREATE TABLE products (
	item_id INT auto_increment primary key,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price decimal(10),
    stock_qty INT(10)
)

INSERT INTO bamazon.products (product_name, department_name, price, stock_qty)
VALUES
('tuna', 'non_perishables', 1, 100),
('lettuce', 'produce', 2.25, 10),
('hat', 'clothing', 25, 25),
('pen', 'office_supplies', 2, 1000),
('macbook', 'electronics', 1499.99, 10),
('guitar', 'instruments', 1199.99, 10),
('cd', 'music' , 9.99, 20),
('vinyl', 'music', 12.99, 20),
('downloads', 'music', 9.99, 100),
('rake', 'lawn_and_garden', 19.99, 10),
('loppers', 'lawn_and_garden', 14.99, 5)

CREATE TABLE department (
	department_id INT auto_increment primary key,
  department_name VARCHAR(50) NOT NULL,
  over_head_costs DECIMAL(10, 2) NOT NULL
);

ALTER TABLE products
ADD COLUMN product_sales DECIMAL(10, 2);

INSERT INTO bamazon.department (department_name, over_head_costs)
VALUES
('non_perishables', 500),
('product', 500),
('clothing', 1000),
('electronics', 5000),
('instruments', 500),
('music', 500),
('office_supplies', 500);



SELECT department_id, dept.department_name, over_head_costs, sum(product_sales)
FROM bamazon.products prods
INNER JOIN bamazon.department dept
ON prods.department_name = dept.department_name
where dept.department_id = '8'