import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

import ListComponent from './components/product/list.component';
import CreateComponent from './components/product/create.component';
import EditComponent from './components/product/edit.component';
import AboutComponent from './components/about/index.component';
import LoginComponent from './components/auth/login.component';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
  const logoutHandler = async () => {
    await axios.post('http://localhost:8000/api/logout');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <Navbar bg="primary" variant="dark" className="shadow-sm">
        <Container>
          <Navbar.Brand><Link to={"/"} className="text-white text-decoration-none fw-bold">My Inventory</Link></Navbar.Brand>
          <Nav className="ms-auto">
            {token ? (
              <Button variant="danger" size="sm" onClick={logoutHandler}>Logout</Button>
            ) : (
              <Link to={"/login"} className="nav-link text-white">Login</Link>
            )}
          </Nav>
        </Container>
      </Navbar>

      <main className="flex-shrink-0 mb-5">
        <Routes>
          {/* Halaman Terbuka */}
          <Route path='/login' element={!token ? <LoginComponent /> : <Navigate to="/" />} />

          {/* Halaman Terkunci */}
          <Route path='/' element={token ? <ListComponent /> : <Navigate to="/login" />} />
          <Route path='/product/create' element={token ? <CreateComponent /> : <Navigate to="/login" />} />
          <Route path='/product/edit/:id' element={token ? <EditComponent /> : <Navigate to="/login" />} />
          <Route path='/about' element={token ? <AboutComponent /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;