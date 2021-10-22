const express = require("express");
const app = express();
const fs = require("fs");
const cors = require('cors')
app.use(cors());
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// users

app.get("/api/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync("data/users.json").toString());
  res.json(users.data);
});

app.post("/api/users", (req, res) => {
  const { _id, name, age, gender } = req.body;
  if (!name || !age || !gender) {
    res
      .status(400)
      .json({ success: false, message: "Name, Age, Gender is required !!" });
  }
  const users = JSON.parse(fs.readFileSync("data/users.json").toString());
  const newUser = {
    _id: Math.random().toString(36).slice(-8),
    name,
    age,
    gender,
  };
  users.data.push(newUser);

  fs.writeFileSync("data/users.json", JSON.stringify(users));
  res.status(201).json({ success: true, message: "Created user", newUser });
});

app.get("/api/users/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync("data/users.json").toString());
  
  const user = users.data.find((user) => user._id === req.params.id);
  !user
    ? res.status(404).json({ success: false, message: "User does not exist" })
    : res.json(user);
});

app.put("/api/users/:id", (req, res) => {
    const { name, age, gender } = req.body;
    if (!name || !age || !gender) {
        res
          .status(400)
          .json({ success: false, message: "Name, Age, Gender is required !!" });
      }
      const users = JSON.parse(fs.readFileSync("data/users.json").toString());
      const index = users.data.findIndex((user) => user._id === req.params.id);
      if(index === -1){
        res.status(404).json({ success: false, message: "User does not exist" })
      }
      console.log(index);
      users.data[index].name = name
      users.data[index].age = age
      users.data[index].gender = gender
      fs.writeFileSync("data/users.json", JSON.stringify(users));
      res.status(200).json({ success: true, message: "User updated", updatedUser: users.data[index] });
});

app.delete("/api/users/:id", (req, res) => {
    const users = JSON.parse(fs.readFileSync("data/users.json").toString());
    const index = users.data.findIndex((user) => user._id === req.params.id);
    if(index === -1){
      res.status(404).json({ success: false, message: "User does not exist" })
    }
    console.log(users.data[index]);
    users.data.splice(index, 1);
    fs.writeFileSync("data/users.json", JSON.stringify(users));
      res.status(204)
});

// products
app.get("/api/products", (req, res) => {
    const products = JSON.parse(fs.readFileSync("data/products.json").toString());
   res.json(products.data);
});

app.post("/api/products", (req, res) => {
    const { _id, name, madeIn } = req.body;
  if (!name || !madeIn) {
    res
      .status(400)
      .json({ success: false, message: "Name, madeIn,is required !!" });
  }
  const products = JSON.parse(fs.readFileSync("data/products.json").toString());
  const newProduct = {
    _id: Math.random().toString(36).slice(-8),
    name,
    madeIn
    
  };
  products.data.push(newProduct);

  fs.writeFileSync("data/products.json", JSON.stringify(products));
  res.status(201).json({ success: true, message: "Created product", newProduct });
});

app.get("/api/products/:id", (req, res) => {
    const products = JSON.parse(fs.readFileSync("data/products.json").toString());
  
    const product = products.data.find((product) => product._id === req.params.id);
    !product
      ? res.status(404).json({ success: false, message: "product does not exist" })
      : res.json(product);
});

app.put("/api/products/:id", (req, res) => {
    const { name,  madeIn } = req.body;
    if (!name ||  !madeIn) {
        res
          .status(400)
          .json({ success: false, message: "Name, madeIn,is required !!" });
      }
      const products = JSON.parse(fs.readFileSync("data/products.json").toString());
      const index = products.data.findIndex(([product]) => product._id === req.params.id);
      if(index === -1){
        res.status(404).json({ success: false, message: "product does not exist" })
      }
      console.log(index);
      products.data[index].name = name
      products.data[index].madeIn = madeIn
      fs.writeFileSync("data/products.json", JSON.stringify(users));
      res.status(200).json({ success: true, message: "products updated", updatedProduct: products.data[index] });
});

app.delete("/api/products/:id", (req, res) => {
    const products = JSON.parse(fs.readFileSync("data/products.json").toString());
    const index = products.data.findIndex((prod) => prod._id === req.params.id);
    if(index === -1){
      res.status(404).json({ success: false, message: "Product does not exist" })
    }
    
    products.data.splice(index, 1);
    fs.writeFileSync("data/products.json", JSON.stringify(products));
      res.status(204)
});

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(process.env.PORT || 3000);
