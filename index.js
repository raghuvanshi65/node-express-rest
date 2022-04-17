const express = require("express");
const bodyparser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const pool = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "root",
  database: "employeedb",
  debug: false,
});

app.get("/get/employee/:id", function (req, res) {
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ?";
  let userId = req.params.id;
  let query = mysql.format(selectQuery, ["employee", "id", userId]);
  pool.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return;
    } else if (!data[0]) {
      res.json({ status: "Not found!" });
    } else {
      res.json(data[0]);
    }
  });
});

app.get("/get/employees", function (req, res) {
  let selectQuery = "SELECT * FROM ??";
  let query = mysql.format(selectQuery, ["employee"]);
  pool.query(query, (err, data) => {
    if (err) {
      console.error(err);
      return;
    } else if (!data) {
      res.json({ status: "Not found!" });
    } else {
      res.json(data);
    }
  });
});

app.post("/add/employee", function (req, res) {
  const data = {
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    contact: req.body.contact,
    password: req.body.password,
  };
  let insertQuery = "INSERT INTO ?? (??,??,??,??,??) VALUES (?,?,?,?,?)";
  let query = mysql.format(insertQuery, [
    "employee",
    "fName",
    "lName",
    "email",
    "contact",
    "password",
    data.fName,
    data.lName,
    data.email,
    data.contact,
    data.password,
  ]);
  pool.query(query, (err, response) => {
    if (err) {
      console.error(err);
      res.json({ status: "failure", reason: err.code });
    } else {
      res.json({ status: "success", data: data });
    }
  });
});

app.put("/update/employee/:id", function (req, res) {
  let userId = req.params.id;
  let selectQuery = "SELECT * FROM ?? WHERE ?? = ?";
  let q = mysql.format(selectQuery, ["employee", "id", userId]);
  pool.query(q, (err, result) => {
    if (err) {
      console.error(err);
      return;
    } else if (!result[0]) {
      res.json({ status: "Not found!" });
    } else {
      const data = {
        fName: req.body.fName ? req.body.fName : result[0].fName,
        lName: req.body.lName ? req.body.lName : result[0].lName,
        email: req.body.email ? req.body.email : result[0].email,
        contact: req.body.contact ? req.body.contact : result[0].contact,
        password: req.body.password ? req.body.password : result[0].password,
      };
      let updateQuery =
        "UPDATE ?? SET ?? = ?,?? = ?,?? = ?,?? = ?,?? = ? WHERE ?? = ?";
      let query = mysql.format(updateQuery, [
        "employee",
        "fName",
        data.fName,
        "lName",
        data.lName,
        "email",
        data.email,
        "contact",
        data.contact,
        "password",
        data.password,
        "id",
        userId,
      ]);
      pool.query(query, (err, response) => {
        if (err) {
          console.error(err);
          res.json({ status: "failure", reason: err.code });
        } else {
          res.json({ status: "success", data: data });
        }
      });
    }
  });
});

app.delete("/delete/employee/:id", function (req, res) {
  let deleteQuery = "DELETE from ?? where ?? = ?";
  let userId = req.params.id;
  let query = mysql.format(deleteQuery, ["employee", "id", userId]);
  pool.query(query, (err, response) => {
    if (err) {
      console.error(err);
      res.json({ status: "failure", reason: err.code });
    } else {
      res.json({ status: "success" });
    }
  });
});

app.listen(3000, function () {
  console.log("Server 3000");
});
