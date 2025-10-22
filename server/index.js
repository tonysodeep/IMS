import express from "express";
import cors from "cors";
import connectDB from "./db/connections.js";
import authRouter from "./routes/auth.js";
import categoryRouter from "./routes/category.js";
import supplierRouter from "./routes/supplier.js";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";

const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  connectDB();
  console.log(`server is running at port ${port} ...`);
});
