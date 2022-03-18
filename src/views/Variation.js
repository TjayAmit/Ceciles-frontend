import React, { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import DataTable from "react-data-table-component"
import DataTableExtensions from 'react-data-table-component-extensions';


// reactstrap components
import {
  Card,
  CardBody,
  Row,
  Col,
  Navbar,
  NavbarToggler,
  Button,
  CardHeader,
  FormGroup,
  Input,
  Form,
  CardTitle,
  CardFooter,
  Collapse,
  Modal
} from "reactstrap"

import axios from "axios"
import { createFalse, createSourceFile, findConfigFile } from "typescript";
import { css } from "jquery";

function Variation() {
  const [Variation, setVariation] = useState([])


  //Modal
  const [modalAddVariation, setModalAddVariation] = useState(false)  

  //Loading animaition
  const [pending, setPending] = useState(true)

  // Add Function
  const [variation_id, setVariationID] = useState("")
  const [variation_label, setVariationLabel] = useState("")
  const [variation_value, setVariationValue] = useState("")

// Function
  const AddVariation = () => {
    axios.post("http://localhost:5000/ceciles/variations/",{
        variation_label,
        variation_value,
      }).then((response) =>{
        if(response.data.success == 1){
            console.log(response.data.message);
        } else {
            console.log("response.data.message");
        }
    });
    setModalAddVariation(false);
  }

  const DeleteVariation = () => {
    axios.delete("http://localhost:5000/ceciles/variations/"    )
    .then((response) =>{
        if(response.data.success == 1){
            console.log(response.data.message);
        } else {
            console.log("response.data.message");
        }
    });
    setModalAddVariation(false);
  }


  
  useEffect(() => {
    async function getVariation() {
      const { data: {data} } = await axios.get("http://localhost:5000/ceciles/variations/all")
      setVariation(data)
      console.log(data)
    }

    getVariation()


    const timeout = setTimeout(() => {
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);

  },[])

  const columns = [
    {
        name: '#',
        cell: (row, index) => ++index,
        sortable: true,
        width: '5%',
        ignoreRowClick: false,
    },
    
    {
        name: 'ID',
        cell: row => row.variation_id,
        sortable: true,
        hide: 'xl',
        
    },

    {
        name: 'Label',
        cell: row => row.variation_label,
        sortable: true,
    },

    {
        name: 'Value',
        cell: row => row.variation_value,
        sortable: true,
    },
  
    // {
    //   name: 'Action',
    //   cell: row => <Button color="danger" type="button" className="btn-round" onClick={() => DeleteVariation(row.variation_id) }>Delete</Button>,
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true,
    //   selectableRows: true,
    // },
  ]

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue"></div>
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

                            <Collapse navbar>
                                <Form inline className="ml-auto">
                                    <Button color="warning" type="button" className="btn-round" size="lg" onClick={() => setModalAddVariation(true)}> 
                                        ADD VARIATION
                                    </Button>
                                </Form>
                            </Collapse>
                            </Navbar>
                        </CardHeader>

                        <CardBody>
                            <DataTableExtensions columns={columns} data={Variation}>
                            <DataTable 
                                responsive={true}
                                pagination 
                                columns={columns} 
                                data={Variation}
                                highlightOnHover
                                progressPending={pending}
                            />
                            </DataTableExtensions>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>

        <Modal isOpen={modalAddVariation} className="modal-md" modalClassName="bd-example-modal-lg" toggle={() => setModalAddVariation(false)}>
            <div className="modal-header    ">
            <h4 className="modal-title" id="myLargeModalLabel">
                Add Variation
            </h4>
            <button aria-label="Close" className="close" type="button" onClick={() => setModalAddVariation(false)}>
                <span aria-hidden={true}>×</span>
            </button>
            </div>

            <div className="modal-body">
            <div className="row">
                <div className="container">
                    <div className="form-row">
                        <Col md={12}>
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">Label</label>
                                <Input id="label" type="text" onChange={(e) => setVariationLabel(e.target.value)} />
                            </FormGroup>

                            <FormGroup className="col-md-12">
                                <label htmlFor="value">Value</label>
                                <Input id="value" type="text" onChange={(e) => setVariationValue(e.target.value)} />
                            </FormGroup>
                        </Col>
                    </div>
                </div>
            </div>
            </div>

            <div className="modal-footer">
                <div className="ml-auto">
                    <Button className="btn-round" color="info" size="lg" onClick={() => AddVariation() }>Add</Button>
                </div>
            </div>
      </Modal>
    </>
  );
}

export default Variation;
