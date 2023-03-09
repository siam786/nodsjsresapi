const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const shortid = require("shortid");
const fs = require("fs/promises");
const path = require("path");
const dblocation = path.resolve("src", "./data.json");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


//delete data 
app.delete('/:id',async(req,res)=>{
  const id = req.params.id;
  const data = await fs.readFile(dblocation);
  const players = JSON.parse(data);
  let player = players.find((item) => item.id === id);
  if(!player){
    return res.status(404).json({message: "Player not found"});
  }

  const newplayers = players.filter((item=> item.id !== id))
  await fs.writeFile(dblocation,JSON.stringify(newplayers))
  res.status(203).send();
}) 
//put data
app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await fs.readFile(dblocation);
  const players = JSON.parse(data);
  let player = players.find((item) => item.id === id);
  if (!player) {
    player = {
      ...req.body,
      id: shortid.generate(),
    };
    players.push(player);
  } else {
    player.name = req.body.name;
    player.country = req.body.country;
    player.position = req.body.position;
    player.rank = req.body.rank;
    
  }
  await fs.writeFile(dblocation,JSON.stringify(players));
  res.status(200).json(player);
});

//patch data
app.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await fs.readFile(dblocation);
  const players = JSON.parse(data);
  const player = players.find((item) => item.id === id);
  if (!player) {
    return res.status(404).json({ message: "Player not found" });
  }
  player.name = req.body.name || player.name;
  player.country = req.body.country || player.country;
  player.position = req.body.position || player.position;
  player.rank = req.body.rank || player.rank;
  await fs.writeFile(dblocation, JSON.stringify(players));
  res.status(201).json(player);
});

// find by id
app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await fs.readFile(dblocation);
  const players = JSON.parse(data);
  const player = players.find((item) => item.id === id);
  if (!player) {
    res.status(404).json({ message: "Player Not found" });
  }
  res.status(201).json(player);
});

// post data
app.post("/", async (req, res) => {
  const player = {
    ...req.body,
    id: shortid.generate(),
  };

  const data = await fs.readFile(dblocation);
  const players = JSON.parse(data);
  players.push(player);
  await fs.writeFile(dblocation, JSON.stringify(players));
  res.status(201).json(player);
});

// find player
app.get("/", async (req, res) => {
  const data = await fs.readFile(dblocation);
  const players = JSON.parse(data);
  res.status(201).json(players);
});

//get health
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening Port ${port}`);
  console.log(`localhost:${port}`);
});
