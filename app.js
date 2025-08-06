const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express(); // 

app.use(cors()); // 
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "myown"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL!");
    }
});

app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

app.post("/add-to-cart", (req, res) => {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
    }
    
    db.query("INSERT INTO cart (product_id, quantity) VALUES (?, ?)", [product_id, quantity], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: "Added to cart!" });
        }
    });
});

app.get("/cart", (req, res) => {
    db.query("SELECT cart.id, products.name, products.price, cart.quantity FROM cart JOIN products ON cart.product_id = products.id", 
    (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

app.delete("/cart/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM cart WHERE id = ?", [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({ message: "Item removed from cart!" });
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
