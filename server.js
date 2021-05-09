const express = require("express");
const app = express();
const http = require("http").createServer(app);
const PORT = process.env.PORT || 4000;
const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  }
);

io.on("connection", socket => {
  console.log("test");
  socket.on("calculate", (equation) => {
    io.emit("calculate", equation)
  })
  socket.on('error', function (err) {
    console.log(err);
  });
});

// Start the API server
http.listen(PORT, function () {
  console.log(`🌎  ==> Socket Server now listening on PORT ${PORT}!`);
});