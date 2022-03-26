import React, { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import DataTable from "react-data-table-component"
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
  Modal
} from "reactstrap"

import axios from "axios"

function RegularTables() {
  const [pending, setPending] = React.useState(true); 
  const [products, setProducts] = useState([])
  
  const [modalAddProduct,setModalAddProduct] = useState(false);

  const [productid,setProductID] = useState('');
  const [productname,setProductName] = useState('');
  const [principalid,setPrincipalID] = useState('');
  const [principalname,setPrincipalName] = useState('');
  const [moqlabel,setMOQLabel] = useState('');
  const [moqvalue,setMOQValue] = useState('');


  const addProduct = () => {
    if(productid != '' && productname != '' && principalid != '' && principalname != '' && moqlabel != '' && moqvalue != ''){
      axios.post(`http://localhost:5000/ceciles/products/`,{
        productid:productid,
        productname:productname,
        principalid:principalid,
        principalname:principalname,
        moqlabel:moqlabel,
        moqvalue:moqvalue
      }).
      then((response) => {
        if(response.data.success == 1){
          getProducts()
          setModalAddProduct(false)
          defaultvariable();
        }
      });
    }
  }

  const defaultvariable = () => {
    setProductID('')
    setProductName('')
    setPrincipalID('')
    setPrincipalName('')
    setMOQLabel('')
    setMOQValue('')
  }

  const columns = [
    {
        name: 'Product ID',
        selector: row => row.product_id,
        sortable: true,
    },

    {
        name: 'Product Name',
        selector: row => row.product_name,
        sortable: true,
    },

    {
      name: 'UOM',
      selector: row => row.uom,
      sortable: true,
    },

    {
      name: 'UOM Value',
      selector: row => row.uom_value,
      sortable: true,
    },
    {
      name: 'Manufacturer',
      selector: row => row.principal_name,
      sortable: true,
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
                <Button className="btn-round" color="success" size="md" onClick={() => addProduct() }>Submit</Button>
              </div>
            </div>
      </Modal>
    </>
  );
}

export default RegularTables;
