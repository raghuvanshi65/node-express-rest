create database employeedb;
use employeedb;

create table employee(
id int not null auto_increment,
fName varchar(255),
lName varchar(255),
email varchar(255),
contact varchar(20),
password varchar(255),
primary key (id)
);
