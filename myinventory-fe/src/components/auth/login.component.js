import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email: email,
                password: password
            });
            localStorage.setItem('token', response.data.access_token);
            navigate('/');
            window.location.reload();
        } catch (error) {
            Swal.fire({ icon: 'error', text: 'Email atau Password salah!' });
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h4 className="text-center mb-4">Login Gudang</h4>
                            <Form onSubmit={loginHandler}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                                <Button variant="primary" className="w-100" type="submit">Masuk</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;