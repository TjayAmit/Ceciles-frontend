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
} from "reactstrap"

import axios from "axios"

function RegularTables() {
  const [pending, setPending] = React.useState(true); 
  const [products, setProducts] = useState([])
  
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

  useEffect(() => {
    async function getProducts() {
      const { data: {data} } = await axios.get("http://localhost:5000/ceciles/products/all")
      setProducts(data);
    }

    getProducts()

    const timeout = setTimeout(() => {
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);
  },[])

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div className="container"></div>
        <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
              <Navbar expand="lg" color="info">
                    <NavbarToggler>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                    </NavbarToggler>
                    <h4>Product Master List</h4>
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
      </div>
    </>
  );
}

export default RegularTables;
