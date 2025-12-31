import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Mock data
const rides = [
  { app: "Uber", price: 210, time: "5 min", route: "college-mall" },
  { app: "Ola", price: 180, time: "6 min", route: "college-mall" },
  { app: "Rapido", price: 160, time: "4 min", route: "station-market" },
  { app: "Bolt", price: 220, time: "8 min", route: "college-market" },
];

const matches = [
  { name: "Anjali", from: "college", to: "mall", seats: 2 },
  { name: "Ravi", from: "station", to: "market", seats: 1 },
  { name: "Kiran", from: "college", to: "market", seats: 3 },
];

app.get("/api/rides", (req, res) => {
  const { pickup, destination } = req.query;
  if (pickup && destination) {
    const key = `${pickup.toLowerCase()}-${destination.toLowerCase()}`;
    return res.json(rides.filter((r) => r.route === key));
  }
  res.json(rides);
});

app.get("/api/matches", (req, res) => {
  const { pickup, destination } = req.query;
  if (pickup && destination) {
    return res.json(
      matches.filter(
        (m) =>
          m.from.toLowerCase() === pickup.toLowerCase() &&
          m.to.toLowerCase() === destination.toLowerCase()
      )
    );
  }
  res.json(matches);
});

app.listen(4000, () => console.log("✅ Server running on http://localhost:4000"));
