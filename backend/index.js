const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");

require("./utils/workerLoop.js");

const userRoutes = require("./routes/userRoute.js");
const chatRoutes = require("./routes/chatRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const jobRoutes = require("./routes/jobRoutes.js");
const campusRoutes = require("./routes/campusRoutes.js");
const notesRoutes = require("./routes/notesRoutes.js")
const resultRoutes = require("./routes/result.routes.js");
const errorhandler = require("./middlewares/error.middleware.js");

const app = express();

app.use(helmet());
const allowedOrigins = [
  "https://placement-records.vercel.app",
  "http://localhost:5173",
  "https://www.adgipshub.online" 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json({limit : "10kb"}));

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/campus", campusRoutes);
app.use("/api/notes",notesRoutes);
app.use("/api", resultRoutes);

app.use(errorhandler);

if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error(err));
