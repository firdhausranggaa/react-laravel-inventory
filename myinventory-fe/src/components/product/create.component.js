import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreateComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState();
  const [validationError, setValidationError] = useState({});

  const changeHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const createProduct = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) formData.append('image', image);

    setLoading(true);

    await axios.post(`http://localhost:8000/api/products`, formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    }).then(({ data }) => {
      Swal.fire({
        icon: 'success',
        text: data?.message || 'Produk berhasil ditambahkan!'
      });
      navigate('/');
    }).catch((error) => {
      const response = error.response;
      if (response?.status === 422) {
        setValidationError(response.data.errors);
      } else {
        Swal.fire({
          icon: 'error',
          text: response?.data?.message || 'Sesi habis atau terjadi kesalahan.'
        });
      }
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h4 className="card-title text-primary fw-bold">Create Product</h4>
              <hr />
              <div className="form-wrapper">
                {
                  Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {
                              Object.entries(validationError).map(([key, value]) => (
                                <li key={key}>{value}</li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
                <Form onSubmit={createProduct}>
                  <Row>
                    <Col>
                      <Form.Group controlId="Name">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" required value={title} onChange={(event) => {
                          setTitle(event.target.value)
                        }} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" required rows={3} value={description} onChange={(event) => {
                          setDescription(event.target.value)
                        }} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="Image" className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" required onChange={changeHandler} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button disabled={loading} variant="primary" className="mt-2 w-100 shadow-sm" size="lg" type="submit">
                    {loading ? 'Menyimpan Data...' : 'Save Product'}
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateComponent;