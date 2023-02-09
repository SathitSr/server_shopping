const app = require("express")();
const server = require("http").createServer(app);
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const port = 3500;
let products = require("./src/constants/products.json");
let toship = require("./src/constants/toship.json");
let carts = require("./src/constants/cart.json");
let promotions = require("./src/constants/promotions.json");
let users = require("./src/constants/users.json");

// other api //
app.get("/", async (req, res) => {
  res.send("/api/");
});

//add product
app.post("/api/add-products", async (req, res) => {
  let newId = products.length + 1;
  let newProducts = { ...req.body.newProduct, newId };
  products.push(newProducts);
  res.send("success");
});

//delete product
app.post("/api/delete", async (req, res) => {
  const deleteProducts = products.filter(
    (item) => item.id !== req.body.product_id
  );

  products = [];
  products.push(...deleteProducts);
  res.send("success");
});

// feature home //
//get all product
app.get("/api/get-products", async (req, res) => {
  res.send(products);
});

//add product to cart
app.post("/api/add-cart", async (req, res) => {
  var grtProduct = products.filter((el) => el.id === req.body.product_id);

  carts.push({
    user_id: req.body.user_id,
    product_id: req.body.product_id,
    products: grtProduct,
  });

  res.send("success");
});

// feature promotion //
//get promotion
app.get("/api/promotion", async (req, res) => {
  res.send(promotions);
});

// feature cart //
//product in cart
app.get("/api/cart", async (req, res) => {
  console.log("check req : ", req.query.user_id);
  var product_in_cart = carts.filter((el) => el.user_id == req.query.user_id);
  res.send(product_in_cart);
});

//check out
app.post("/api/checkout", async (req, res) => {
  let prepareToShip = [];
  let temp = [];

  //checkout
  carts.filter((item) => {
    req.body.product_id.map((el) => {
      if (item.product_id === el && item.user_id === req.body.user_id) {
        temp.push(item);
      }
    });
  });

  carts = [];

  prepareToShip.push({
    user_id: 1,
    address: req.body.address,
    product: temp,
  });

  toship.push(prepareToShip);
  res.send(temp);
});

//feature profile//
app.get("/api/users", (req, res) => {
  let tempUser = [];
  users.map((el) => {
    if (parseInt(el.id) === parseInt(req.query.user_id)) {
      tempUser.push(el);
    }
  });

  res.send(tempUser);
});

app.post("/api/users/login", (req, res) => {
  let tempUser = users.filter((item) => {
    if (
      item.user_name === req.body.user_name &&
      item.password === req.body.password
    ) {
      return item;
    }
  });
  res.send(tempUser);
});

app.post("/api/users/register", (req, res) => {
  let validate = 0;
  users.filter((item) => {
    if (item.user_name === req.body.user_name) {
      validate = 1;
    }
  });

  if (validate === 0) {
    users.push({
      id: users.length + 1,
      name: req.body.name,
      phone: req.body.phone,
      avata: req.body.avata,
      user_name: req.body.user_name,
      password: req.body.password,
    });
    res.send(users);
  } else {
    res.status(400);
    res.send("user name is exit.");
  }
});

//Action ship//
//to ship
app.get("/api/toship", async (req, res) => {
  var to_ship = toship.filter((el) => el.user_id === req.body.user_id);
  res.send(to_ship);
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
