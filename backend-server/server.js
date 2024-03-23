const express =require('express');
const bodyParser = require("body-parser");
const app = express();
const cors =require('cors');

const PORT = process.env.PORT || 4000;
console.log("server is running on port 4000");

app.use(bodyParser.json());
//Middleware för förfrågningar på olika portar
app.use(cors({
    origin: 'http://localhost:5173' // Ange den faktiska domänen för din frontend-applikation här
  }));
  

//Routes

//Mockdata.Ersätt med med hämtning från databas
const currentAuctions = [
  { id: 1, title: "Auktion 1", status: "open" },
  { id: 2, title: "Auktion 2", status: "open" },
];

app.get("/api/auctions/current", (req, res) => {
  res.json(currentAuctions);
});
