import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './pages/home_page/home.jsx';
import Navbar from './components/navbar_component/navbar.jsx';
import Guitars from "./pages/guitars_page/guitars.jsx";
import Profile from "./pages/profile_page/profile.jsx";
import Product_guitar from "./pages/product_guitar_page/product_guitar.jsx";
import Product_piano from "./pages/product_piano_page/product_piano.jsx";
import Drums from "./pages/drums_page/drums.jsx";
import Product_drum from "./pages/product_drum_page/product_drum.jsx";
import Pianos from "./pages/pianos_page/pianos.jsx";
import {AuthProvider} from "./utils/authContext.jsx";
import Login from "./pages/login_page/login.jsx";
import Register from "./pages/register_page/register.jsx";
import ProtectedRoute from "./utils/protectedRoute.jsx";
import AddGuitar from "./pages/add_guitar_page/add_guitar.jsx";
import AddDrum from "./pages/add_drum_page/add_drum.jsx";
import AddPiano from "./pages/add_piano_page/add_piano.jsx";
import Cart from "./pages/cart_page/cart.jsx";
function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                    <Route path="/guitars" element={<Guitars/>}/>
                    <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
                    <Route path="/guitars/add" element={<ProtectedRoute roles={['ADMIN']}><AddGuitar/></ProtectedRoute>}/>
                    <Route path="/drums/add" element={<ProtectedRoute roles={['ADMIN']}><AddDrum/></ProtectedRoute>}/>
                    <Route path="/pianos/add" element={<ProtectedRoute roles={['ADMIN']}><AddPiano/></ProtectedRoute>}/>
                    <Route path="/pianos" element={<Pianos/>}/>
                    <Route path="/drums" element={<Drums/>}/>
                    <Route path="/guitars/:id" element={<Product_guitar/>}/>
                    <Route path="/pianos/:id" element={<Product_piano/>}/>
                    <Route path="/drums/:id" element={<Product_drum/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
