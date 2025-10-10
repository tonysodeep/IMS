import express from "express";
import cors from "cors";
import connectDB from "./db/connections.js";
import authRouter from "./routes/auth.js";
import categoryRouter from "./routes/category.js";

const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);

app.listen(port, () => {
  connectDB();
  console.log(`server is running at port ${port} ...`);
});
