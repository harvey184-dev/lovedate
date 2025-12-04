require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ==========================
   MIDDLEWARE
========================== */
app.use(cors());
app.use(express.json({ limit: "20mb" }));

/* ==========================
   CONNECT MONGODB
========================== */
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "love_notes"
  })
  .then(() => console.log("✅ MongoDB đã kết nối"))
  .catch((err) => console.error("❌ MongoDB lỗi:", err));

/* ==========================
   SCHEMA
========================== */
const NoteSchema = new mongoose.Schema({
  text: String,
  img: String,
  mood: String,
  createdAt: Number,
  reply: String // bạn tự trả lời
});

const Note = mongoose.model("Note", NoteSchema);

/* ==========================
   API: LẤY TẤT CẢ NOTE
========================== */
app.get("/notes", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: 1 });
  res.json(notes);
});

/* ==========================
   API: LỌC NOTE THEO MOOD
========================== */
app.get("/notes/filter", async (req, res) => {
  const { mood } = req.query;
  const notes = await Note.find(mood ? { mood } : {}).sort({ createdAt: 1 });
  res.json(notes);
});

/* ==========================
   API: THÊM NOTE
========================== */
app.post("/addNote", async (req, res) => {
  try {
    const { text, img, mood, createdAt } = req.body;

    const newNote = new Note({ text, img, mood, createdAt });
    await newNote.save();

    res.json({ success: true, note: newNote });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

/* ==========================
   API: SỬA NOTE
========================== */
app.put("/notes/:id", async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json({ success: true, note: updated });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

/* ==========================
   API: XOÁ NOTE
========================== */
app.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

/* ==========================
   API: TRẢ LỜI NOTE
========================== */
app.put("/reply/:id", async (req, res) => {
  try {
    const { reply } = req.body;

    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { reply },
      { new: true }
    );

    res.json({ success: true, note: updated });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

/* ==========================
   START SERVER
========================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
