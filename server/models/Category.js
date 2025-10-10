import moogoose from "mongoose";

const categorySchema = new moogoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryDescription: {
    type: String,
    required: true,
  },
});

const CategoryModel = moogoose.model("Category", categorySchema);
export default CategoryModel;
