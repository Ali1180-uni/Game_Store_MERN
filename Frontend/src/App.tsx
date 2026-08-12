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
import Order from "./components/Order";
import Checkout from "./components/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./components/AdminDashboard";
import AddEmployee from "./components/Admin/AddEmployee";
import EditOrder from "./components/Admin/EditOrder";
import AddProduct from "./components/Admin/AddProduct";
import SendNotification from "./components/Admin/sendNotification";
import UserReviews from "./components/Admin/userReviews";
import EditProduct from "./components/Admin/EditProduct";

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

          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:id" element={<Order />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/Admin" element={<Admin />}>
              <Route path="users" element={<AddEmployee />} />
              <Route
                path="products"
                element={
                  <div className="space-y-6">
                    <AddProduct />
                    <div className="border-t border-neutral-800 pt-6">
                      <EditProduct />
                    </div>
                  </div>
                }
              />
              <Route path="orders" element={<EditOrder />} />
              <Route path="user-reviews" element={<UserReviews />} />
              <Route path="notifications" element={<SendNotification />} />
            </Route>
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
      </div>
      <CartBar />
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#171717",
            color: "#fff",
            border: "1px solid #404040",
          },
        }}
      />
    </Provider>
  );
}

export default App;
