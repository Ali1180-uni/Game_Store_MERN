import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Games from "./components/Games";
import About from "./components/About";
import Accessories from "./components/Accessories";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/GameVault" element={<Home />} />
        <Route path="/GameVault/Games" element={<Games />} />
        <Route path="/GameVault/About" element={<About />} />
        <Route path="/GameVault/Accessories" element={<Accessories />} />
        <Route path="/GameVault/login" element={<Login />} />
        <Route path="/GameVault/register" element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;