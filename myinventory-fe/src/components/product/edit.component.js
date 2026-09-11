import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const EditComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState();
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem('token');
      await axios.get(`http://localhost:8000/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(({ data }) => {
          const { title, description } = data;
          setTitle(title);
          setDescription(description);
        }).catch((error) => {
          Swal.fire({
            icon: 'error',
            text: 'Gagal mengambil data produk atau Anda tidak memiliki akses.'
          });
          navigate('/');
        });
    }

    fetchProduct();
  }, [id, navigate]);

  const changeHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('_method', 'PATCH');
    formData.append('title', title);
    formData.append('description', description);

    if (image) {
      formData.append('image', image);
    }

    await axios.post(`http://localhost:8000/api/products/${id}`, formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(({ data }) => {
        Swal.fire({
          icon: 'success',
          text: data.message || 'Produk berhasil diperbarui!'
        });
        navigate('/');
      }).catch(({ response }) => {
        if (response?.status === 422) {
          setValidationError(response.data.errors);
        } else if (response?.status === 404 || response?.status === 500) {
          navigate('/');
        } else {
          Swal.fire({
            icon: 'error',
            text: response?.data?.message || 'Terjadi kesalahan saat memperbarui.'
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
              <h4 className="card-title text-success fw-bold">Edit Product</h4>
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
                <Form onSubmit={updateProduct}>
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
                        <Form.Label>Image (Biarkan kosong jika tidak mengubah gambar)</Form.Label>
                        <Form.Control type="file" onChange={changeHandler} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button disabled={loading} variant="success" className="mt-2 w-100 shadow-sm" size="lg" type="submit">
                    {loading ? 'Memperbarui...' : 'Update Product'}
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

export default EditComponent;