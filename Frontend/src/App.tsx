import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Games from "./components/Games";
import About from "./components/About";
import Accessories from "./components/Accessories";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Error from "./components/Error";
import ProductPage from "./components/ProductPage";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import CartBar from "./components/CartBar";
import Cart from "./components/Cart";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Provider store={store}>
      <Navbar />
      <div className="pt-20 flex min-h-screen flex-col bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Games" element={<Games />} />
          <Route path="/About" element={<About />} />
          <Route path="/Accessories" element={<Accessories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/Product/:id" element={<ProductPage />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
      <CartBar />
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#171717", // neutral-900
            color: "#fff",
            border: "1px solid #404040", // neutral-700
          },
        }}
      />
    </Provider>
  );
}

export default App;
