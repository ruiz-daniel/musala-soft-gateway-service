
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.listen(port, console.log(`Server started on port ${port}`));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/gateways", (req, res) => {
  res.send({
    name: 'test',
    ip: '10.2.45.253',
    serial: '129581sdlkhja'
  })
})
  
app.post("/post", (req, res) => {
  console.log("Connected to React");
  res.send("Test");
});
  


