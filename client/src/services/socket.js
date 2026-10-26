
import { io } from "socket.io-client";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const socket = io(API_URL, {
  transports: ["websocket", "polling"],
});

export default socket;







// import { io } from "socket.io-client";

// const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const socket = io(BACKEND_URL, {
//   autoConnect: true,
//   reconnection: true,
// });

// export default socket;
