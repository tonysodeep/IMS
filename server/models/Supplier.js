import moogoose from "mongoose";

const supplierSchema = new moogoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SupplierModel = moogoose.model("Supplier", supplierSchema);
export default SupplierModel;
