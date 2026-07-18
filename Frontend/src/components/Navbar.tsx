import { Route } from "react-router-dom";
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import About from "./About.tsx";
import Games from "./Games.tsx";
import Accessories from "./Accessories.tsx";
import Home from "./Home.tsx";

const Navbar = () => {
  return (
    <div>
      <button><Route path="/GameVault" element={<Home />} /></button>
      <button><Route path="/GameVault/Games" element={<Games />} /></button>
      <button><Route path="/GameVault/About" element={<About />} /></button>
      <button><Route path="/GameVault/login" element={<Login />} /></button>
      <button><Route path="/GameVault/register" element={<Register />} /></button>
      <button><Route path="/GameVault/Accessories" element={<Accessories />} /></button>
    </div>
  );
};

export default Navbar;
