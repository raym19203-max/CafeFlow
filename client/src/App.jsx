import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import EsewaSuccess from "./pages/EsewaSuccess";
import EsewaFailure from "./pages/EsewaFailure";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import Offers from "./pages/Offers";

function App() {
  return (
    <BrowserRouter>

      <CartProvider>

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/menu" element={<Menu />} />

          <Route path="/offers" element={<Offers />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/success"
            element={<OrderSuccess />}
          />

          <Route
            path="/esewa-success"
            element={<EsewaSuccess />}
          />

          <Route
            path="/esewa-failure"
            element={<EsewaFailure />}
          />

          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin"
            element={<Admin />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

        </Routes>

      </CartProvider>

    </BrowserRouter>
  );
}

export default App;