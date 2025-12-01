import express from "express";
import cors from "cors";
import connectDB from "./db/connections.js";
import authRouter from "./routes/auth.js";
import categoryRouter from "./routes/category.js";
import supplierRouter from "./routes/supplier.js";
import itemRouter from "./routes/item.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";
import dashboardRouter from "./routes/dashboard.js";

const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/item", itemRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/dashboard", dashboardRouter);

app.listen(port, () => {
  connectDB();
  console.log(`server is running at port ${port} ...`);
});
