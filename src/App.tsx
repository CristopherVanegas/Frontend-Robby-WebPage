import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Profesores from "./components/Profesores";
import Reuniones from "./components/Reuniones";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de Login SIN Navbar */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas con Navbar */}
        <Route path="/home" element={
          <>
            <Navbar />
            <Home />
          </>
        } />
        
        <Route path="/profesores" element={
          <>
            <Navbar />
            <Profesores />
          </>
        } />
        
        <Route path="/reuniones" element={
          <>
            <Navbar />
            <Reuniones />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;