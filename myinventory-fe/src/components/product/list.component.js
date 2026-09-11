import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import Barcode from 'react-barcode';
import { CSVLink } from 'react-csv';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ListComponent = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showScanner, setShowScanner] = useState(false);
    const recordsPerPage = 5;

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let scanner = null;
        if (showScanner) {
            scanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 100 },
                supportedScanTypes: [0]
            }, false);

            scanner.render(
                (decodedText) => {
                    setSearchQuery(decodedText);
                    setShowScanner(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Tepat Sasaran!',
                        text: `Barang dengan kode ${decodedText} ditemukan.`,
                        timer: 2000,
                        showConfirmButton: false
                    });
                },
                (error) => { /* Proses scanning berjalan senyap */ }
            );
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(e => console.error(e));
            }
        };
    }, [showScanner]);

    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.get(`http://localhost:8000/api/products`, {
                headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            if (Array.isArray(data)) setProducts(data);
            else setProducts([]);
        } catch (error) {
            setProducts([]);
        }
    };

    const deleteProduct = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: 'Data ini akan dihapus secara permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => result.isConfirmed);

        if (!isConfirm) return;

        const token = localStorage.getItem('token');
        try {
            const { data } = await axios.delete(`http://localhost:8000/api/products/${id}`, {
                headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            Swal.fire({ icon: 'success', text: data?.message });
            fetchProducts();
        } catch (error) {
            Swal.fire({ text: error.response?.statusText || "Gagal menghapus", icon: 'error' });
        }
    }

    const filteredProducts = products.filter(product => {
        const query = searchQuery.toLowerCase();
        const barcodeId = `inv-${product.id}`;
        return (
            (product.title && product.title.toLowerCase().includes(query)) ||
            (product.description && product.description.toLowerCase().includes(query)) ||
            (barcodeId.includes(query))
        );
    });

    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const currentRecords = filteredProducts.slice(firstIndex, lastIndex);
    const npage = Math.ceil(filteredProducts.length / recordsPerPage);
    const numbers = [...Array(npage > 0 ? npage + 1 : 1).keys()].slice(1);

    const csvData = filteredProducts.map(p => ({
        ID: `INV-${p.id}`,
        Product_Name: p.title,
        Description: p.description
    }));

    return (
        <div className="container mt-4">
            <div className="row mb-3 align-items-center no-print">
                <div className='col-md-5 d-flex'>
                    <input
                        type="text"
                        className="form-control shadow-sm me-2"
                        placeholder="Cari nama, deskripsi, atau scan barcode..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Button variant="dark" className="shadow-sm" onClick={() => setShowScanner(true)}>
                        📷 Scan
                    </Button>
                </div>
                <div className='col-md-7 text-end mt-3 mt-md-0'>
                    <Button variant="secondary" className="shadow-sm me-2" onClick={() => window.print()}>
                        🖨️ Print Labels
                    </Button>
                    <CSVLink data={csvData} filename={"inventory-report.csv"} className="btn btn-success shadow-sm me-2">
                        📊 Export CSV
                    </CSVLink>
                    <Link className='btn btn-primary shadow-sm' to={"/product/create"}>
                        + Create Product
                    </Link>
                </div>
            </div>

            {/* Modal Kamera Scanner */}
            <Modal show={showScanner} onHide={() => setShowScanner(false)} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Scan Barcode Barang</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="reader" width="100%"></div>
                    <p className="text-center text-muted mt-3 small">
                        Arahkan barcode fisik ke kamera. Sistem akan otomatis memfilter data.
                    </p>
                </Modal.Body>
            </Modal>

            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 text-center align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Image</th>
                                            <th>Detail</th>
                                            <th>Barcode ID</th>
                                            <th className="no-print">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentRecords.length > 0 ? (
                                                currentRecords.map((row, key) => (
                                                    <tr key={key}>
                                                        <td>
                                                            <img alt={row.title} className="rounded shadow-sm" width="80px" height="80px" style={{ objectFit: 'cover' }} src={`http://localhost:8000/storage/product/image/${row.image}`} />
                                                        </td>
                                                        <td className="text-start">
                                                            <div className="fw-bold fs-5 text-primary">{row.title}</div>
                                                            <div className="text-muted small">{row.description}</div>
                                                        </td>
                                                        <td>
                                                            <Barcode value={`INV-${row.id}`} width={1.5} height={40} displayValue={true} fontSize={14} background="transparent" />
                                                        </td>
                                                        <td className="no-print">
                                                            <Link to={`/product/edit/${row.id}`} className='btn btn-sm btn-outline-success me-2'>
                                                                Edit
                                                            </Link>
                                                            <Button variant="outline-danger" size="sm" onClick={() => deleteProduct(row.id)}>
                                                                Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-muted py-4">Produk tidak ditemukan.</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListComponent;