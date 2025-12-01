import moogoose from "mongoose";

const noteSchema = new moogoose.Schema({
  type: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const NoteModel = moogoose.model("Note", noteSchema);
export default NoteModel;
