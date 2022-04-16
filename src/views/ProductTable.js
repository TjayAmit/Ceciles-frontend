import React, { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import DataTable from "react-data-table-component"
import Message from './Message';
import DataTableExtensions from 'react-data-table-component-extensions';

// reactstrap components
import {
  Card,
  CardBody,
  Table,
  Row,
  Col,
  Navbar,
  NavbarToggler,
  Collapse,
  Button,
  CardHeader,
  FormGroup,
  Input,
  Form,
  Modal,
  CardTitle,
  CardFooter
} from "reactstrap"

import axios from "axios"

function RegularTables() {
  const [pending, setPending] = React.useState(true); 
  const [products, setProducts] = useState([])

  const [filename, setFilename] = useState('Choose File');
  const [messagestock, setStockMessage] = useState('');
  const [file, setFile] = useState('');
  
  const [modalAddProduct,setModalAddProduct] = useState(false);
  const [modalimport,setModalImport] = useState(false);

  const [isediting,setIsEditing] = useState(false);

  const [productid,setProductID] = useState('');
  const [productname,setProductName] = useState('');
  const [productprice,setProductPrice] = useState('');
  const [principalid,setPrincipalID] = useState('');
  const [principalname,setPrincipalName] = useState('');
  const [moqlabel,setMOQLabel] = useState('');
  const [moqvalue,setMOQValue] = useState('');

  

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  
  const onSubmitStatus = async e => {
    //Stock Status
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const resUpload = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
  
      const { filename} = resUpload.data;
      setStockMessage(`Importing ${filename}`)
      setTimeout(() => {
        setStockMessage('Processing Data');
      }, 2000);

      const process1 = await axios.post('http://localhost:5000/ceciles/products/import', {
        filename: filename,
      }).then(async(response) => {
        console.log(response);
        if(response.data.success == 1){
          setStockMessage('Import Success');
        }
        if(response.data.success == 0){
          setTimeout(() => {
            setStockMessage('Something went wrong while import Stock Status');
          }, 1000);
        }
        if(response.data.success == -1){
          if(response.data.message.sqlState == 42000){
            setTimeout(() => {
              setStockMessage(`Error Format in ${filename}`);
            }, 1000);
          }else{
            setTimeout(() => {
              setStockMessage('Something went wrong');
            }, 1000);
          }
        }
      })
      .catch((error) =>{
        console.log(error); 
      });

      setFile('');
      setFilename('Choose File');
    } catch (err) {
      if (err) {
        setStockMessage(err.message);
      } else {
        setStockMessage(err.response.data.msg);
      }
    }
  };

  const addProduct = () => {
    setIsEditing(false);
    if(productid != '' && productname != ''&& moqlabel != '' && moqvalue != ''){
      axios.post(`http://localhost:5000/ceciles/products/`,{
        productid:productid,
        productname:productname,
        productprice:productprice,
        principalid:principalid !='' ?principalid:'NONE',
        principalname:principalname !='' ?principalname:'NONE',
        moqlabel:moqlabel,
        moqvalue:moqvalue
      }).
      then((response) => {
        if(response.data.success == 1){
          console.log(response.data )
          getProducts()
          setModalAddProduct(false)
          defaultvariable();
        }
      });
    }
  }

  const editProduct = () => {
    if(productid != '' && productname != ''&& moqlabel != '' && moqvalue != ''){
      axios.put(`http://localhost:5000/ceciles/products/`,{
        productid:productid,
        productname:productname,
        productprice:productprice,
        principalid:principalid !='' ?principalid:'NONE',
        principalname:principalname !='' ?principalname:'NONE',
        moqlabel:moqlabel,
        moqvalue:moqvalue
      }).
      then((response) => {
        if(response.data.success == 1){
          getProducts()
          setModalAddProduct(false)
          defaultvariable();
          setIsEditing(false)
        }
      });
    }
  }

  const deleteProduct = async(id) => {
    axios.delete(`http://localhost:5000/ceciles/products/${id}`).then((response) => {
        if(response.data.success == 1){
          console.log(response.data)
          getProducts()
        }
        if(response.data.success == -1){
          console.log(response.data)
        }
    });
  }
  
  const defaultvariable = () => {
    setProductID('')
    setProductName('')
    setProductPrice('')
    setPrincipalID('')
    setPrincipalName('')
    setMOQLabel('')
    setMOQValue('')
  }

  const rowEdit = (row) => {
    setIsEditing(true)
    setProductID(row.product_id);
    setProductName(row.product_name);
    setProductPrice(row.product_price);
    setPrincipalName(row.principal_name);
    setPrincipalID(row.principal_id);
    setMOQLabel(row.uom);
    setMOQValue(row.uom_value);
    setModalAddProduct(true);
  }

  const columns = [
    {
        name: 'Product ID',
        cell: row => row.product_id,
        selector: row => row.product_id,
        sortable: true,
        width:'20%'
    },
    {
        name: 'Product Name',
        cell: row => row.product_name,
        selector: row => row.product_name,
        sortable: true,
        width:'25%'
    },
    {
        name: 'Price',
        cell: row => row.product_price,
        selector: row => row.product_price,
        sortable: true,
    },
    {
      name: 'UOM',
      cell: row => row.uom,
      selector:row => row.uom,
      sortable: true,
    },
    {
      name: 'UOM Value',
      cell: row => row.uom_value,
      selector: row => row.uom_value,
      sortable: true,
    },
    {
      name: 'Principal ID',
      cell: row => row.principal_id,
      selector: row => row.principal_id,
      sortable: true,
      width:'15%'
    },
    {
      name: 'Manufacturer',
      cell: row => row.principal_name,
      selector: row => row.principal_name,
      sortable: true,
      width:'15%'
    },
    {
      cell: row => <Button color="success" type="button" className="btn-round" onClick={() => rowEdit(row)}>Edit</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      selectableRows: true,
    },
    {
      name: '',
      cell: row => <Button color="danger" type="button" className="btn-round" onClick={() => deleteProduct(row.product_id) }>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      accept: "",
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
  })

  async function getProducts() {
    const { data: {data} } = await axios.get("http://localhost:5000/ceciles/products/all")
    setProducts(data);
  }

  useEffect(() => {

    getProducts()

    const timeout = setTimeout(() => {
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);
  },[])

  return (
    <>
      <div className="page-header clear-filter"  size='md' filter-color="blue"></div>
        <div className="container"></div>
        <div className="content">
          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  <Navbar expand="lg" className="py-2" color="light">
                      <h4>Product Master List</h4>
                      
                    <Collapse navbar>
                        <Form inline className="ml-auto">
                            <Button color="info" type="button" className="btn-round" size="md" onClick={() => setModalAddProduct(true)}> 
                              <i className="now-ui-icons ui-1_simple-add" /> New Product
                            </Button>
                            <Button color="secondary" type="button" className="btn-round" size="md" onClick={() => setModalImport(true)}> 
                              <i className="now-ui-icons ui-1_simple-add" /> Import Product
                            </Button>
                        </Form>
                    </Collapse>
                  </Navbar>
                </CardHeader>

                <CardBody>
                  <DataTableExtensions columns={columns} data={products}>
                    <DataTable 
                      responsive
                      pagination 
                      columns={columns} 
                      data={products} 
                      progressPending={pending}

                    />
                  </DataTableExtensions>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        
        <Modal isOpen={modalAddProduct} className="modal-lg" modalClassName="bd-example-modal-lg" centered>
            <h4 className="modal-title px-4">
                New Product
            </h4>

            <div className="modal-body">
            <Form>
                <div className="container">
                    <Row xs = {2}>
                        <Col md={6}>
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">Product ID</label>
                                <Input id="label" value={productid} type="text"  onChange={(e) => setProductID(e.target.value)} />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">Product Name</label>
                                <Input id="label" value={productname} type="text"  onChange={(e) => setProductName(e.target.value)} />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">Product Price</label>
                                <Input id="label" value={productprice} type="text"  onChange={(e) => setProductPrice(e.target.value)} />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">Principal ID</label>
                                <Input id="label" value={principalid} type="text"  onChange={(e) => setPrincipalID(e.target.value)} />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">UOM Label</label>
                                <Input id="label" value={moqlabel} type="text"  onChange={(e) => setMOQLabel(e.target.value)} />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <label htmlFor="value">UOM Value</label>
                                <Input id="value" value={moqvalue} type="text"  onChange={(e) => setMOQValue(e.target.value)}/>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <label htmlFor="value">Principal Name</label>
                                <Input id="value" value={principalname} type="text"  onChange={(e) => setPrincipalName(e.target.value)}/>
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
            </Form>
            </div>

            <div className="modal-footer">
              <div className="ml-auto">
                <Button className="btn-round" color="secondary" size="md" onClick={() => setModalAddProduct(false) }>Cancel</Button>
                <span> </span>
                <Button className="btn-round" color="success" size="md" onClick={() => isediting? editProduct():addProduct() }>Submit</Button>
              </div>
            </div>
      </Modal>


        
      <Modal isOpen={modalimport} className="modal-md" modalClassName="bd-example-modal-lg" toggle={()=> setModalImport(false)} centered >
            <h4 className="modal-title px-4">Import Product List</h4>
            <div className="modal-body">
              <Row> 
                <Col xs={12} md={12}>
                  <Card className="card-chart" >
                    <CardHeader>
                    {messagestock ? <Message msg={messagestock} /> : null}
                      <CardTitle  className='text-center' tag="h4">Product List</CardTitle>
                      
                    </CardHeader>

                    <CardBody>
                      <div className="chart-area">
                        <form onSubmit={onSubmitStatus}>
                          <p className='text-dark text-center'>Select CSV file to import</p>
                          <div className="container">
                            <Col md={12}>
                              <div className='custom-file mb-4'>
                                <input
                                  type='file' 
                                  className='custom-file-input'
                                  id='customFile'
                                  onChange={onChange}
                                />
                                <label className='custom-file-label' htmlFor='customFile'>
                                  {filename}
                                </label>
                              </div>

                              <input
                              type='submit'
                              value='Upload'
                              className='btn btn-primary btn-block mt-4'
                              />
                            </Col>
                          </div>
                        </form>
                      </div>
                    </CardBody>
                    <CardFooter>
                      <div className="stats text-center">
                      </div>
                    </CardFooter>
                  </Card>
                </Col>
                </Row>
            </div>
      </Modal>
    </>
  );
}

export default RegularTables;
