require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ==========================
   MIDDLEWARE
========================== */
app.use(cors());
app.use(express.json({ limit: "20mb" })); // cho phép upload ảnh Base64 lớn

/* ==========================
   KẾT NỐI MONGODB
========================== */
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "love_notes"
  })
  .then(() => console.log("✅ MongoDB đã kết nối"))
  .catch((err) => console.error("❌ MongoDB lỗi:", err));

/* ==========================
   SCHEMA MONGODB
========================== */
const NoteSchema = new mongoose.Schema({
  text: String,
  img: String,     // Base64
  mood: String,    // vui | buon
  createdAt: Number
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
   API: THÊM NOTE
========================== */
app.post("/addNote", async (req, res) => {
  try {
    const { text, img, mood, createdAt } = req.body;

    const newNote = new Note({ text, img, mood, createdAt });
    await newNote.save();

    console.log("📌 Đã lưu kỷ niệm:", text);

    res.json({ success: true, note: newNote });
  } catch (err) {
    console.log("❌ Lỗi lưu:", err);
    res.json({ success: false, error: err });
  }
});

/* ==========================
   CHẠY SERVER
========================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend đang chạy tại http://localhost:${PORT}`);
});
