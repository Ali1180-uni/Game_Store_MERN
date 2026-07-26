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

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Games" element={<Games />} />
          <Route path="/About" element={<About />} />
          <Route path="/Accessories" element={<Accessories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
