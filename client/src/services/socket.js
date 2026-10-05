// Import socket.io client
import { io } from "socket.io-client";

// Connect to backend server
const socket = io("http://localhost:5000");

// Export socket so it can be used anywhere
export default socket;