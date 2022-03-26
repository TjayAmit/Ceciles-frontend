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
  const [modifier, setModifier] = useState([])

  const [warning, setWarning] = useState('');

  //Modal
  const [modalAddVariation, setModalAddVariation] = useState(false)  
  const [modalAddModifier, setModalAddModifier] = useState(false)

  const [variationModal, setVariationModal] = useState(false)

  //Loading animaition
  const [pending, setPending] = useState(true)

  // Add Function
  const [variation_id, setVariationID] = useState("")
  const [variation_label, setVariationLabel] = useState("")
  const [variation_value, setVariationValue] = useState("")

  const [datefrom, setDateFrom] = useState('');
  const [dateto,setDateTo] = useState('');

// Function
  const AddVariation = () => {
    if(variation_label != '' && variation_value !=''){
        axios.post("http://localhost:5000/ceciles/variations/",{
            label:variation_label,
            value:variation_value,
          }).then((response) =>{
            if(response.data.success == 1){
                setModalAddVariation(false);
                setVariationLabel('');
                setVariationValue('');
            } else {
                console.log(response.data.message);
            }
        });
    }
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


  const retrieveVariation = async() => {
    await axios.get("http://localhost:5000/ceciles/variations/all").
    then((response) => {
        if(response.data.success == -1){
            setWarning = 'Someting happen while retrieving variations'
        }
        if(response.data.success == 1){
            console.log(response.data.data)
            setVariation(response.data.data);
            setVariationModal(true);
        }
    })
  }
  
  useEffect(() => {
    async function getVariation() {
      const { data: {data} } = await axios.get("http://localhost:5000/ceciles/modifiers/all")
      setVariation(data)
    }

    getVariation()

    const timeout = setTimeout(() => {
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);

  },[])

  const variations = [
      {
        name:'ID',
        cell: (row,index) => row.variation_id,
        sortable:true,
        width:'8%'
      },
      {
        name:'Variation Label',
        cell: row => row.variation_label,
        sortable:true,
        width:"30%"
      },
      {
        name:'Percent',
        cell: row => row.variation_value,
        sortable:true,
      },
      {
        name: '',
        cell: row => <Button color="success" type="button" className="btn-round" onClick={() => EditVariation(row.variation_id) }>Edit</Button>,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        selectableRows: true,
        width:"20%"
      },
      {
        name: '',
        cell: row => <Button color="danger" type="button" className="btn-round" onClick={() => DeleteVariation(row.variation_id) }>Delete</Button>,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        selectableRows: true,
      },
  ]

  const columns = [
    {
        name: 'ID',
        cell:  (row, index) => row.variation_id,
        sortable: true,
        width:'5%'
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
    {
        name: 'Date From',
        cell: row => row.date_from,
        sortable: true,
    },
    {
        name: 'Date To',
        cell: row => row.date_to,
        sortable: true,
    },
    {
        name: 'Branch',
        cell: row => row.branch,
        sortable: true,
    },
    {
        name: 'Principal ID',
        cell: row => row.principal,
        sortable: true,
    },
    {
      name: 'Action',
      cell: row => <Button color="danger" type="button" className="btn-round" onClick={() => DeleteVariation(row.variation_id) }>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      selectableRows: true,
    },
  ]

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue"></div>
        <div className="content">
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader>
                            <Navbar expand="lg" color="light">
                            <Collapse navbar>
                                <Form inline className="ml-auto">
                                    <Button color="info" type="button" className="btn-round" size="md" onClick={() => setModalAddModifier(true)}> 
                                    <i className="now-ui-icons ui-1_simple-add" /> New Modifier
                                    </Button>
                                    <div className="content"></div>
                                    <Button color="secondary" type="button" className="btn-round" size="md" onClick={() => retrieveVariation()}> 
                                        View Variation
                                    </Button>
                                </Form>
                            </Collapse>
                            </Navbar>
                        </CardHeader>

                        <CardBody>
                            <DataTableExtensions columns={columns} data={modifier}>
                            <DataTable 
                                responsive={true}
                                pagination 
                                columns={columns} 
                                data={modifier}
                                highlightOnHover
                                progressPending={pending}
                            />
                            </DataTableExtensions>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>


        <Modal isOpen={modalAddModifier}  className="modal-lg" modalClassName="bd-example-modal-lg" centered>
            <div className="modal-header">
                <h3 className="modal-title" id="myLargeModalLabel">New Modifier</h3>
            </div>

            <div className="modal-body">
                <Form>
                    <div className="container">
                        <Row xs ={2} lg={12}>
                            <Col md={6}>
                                <Col xs={12}>
                                    <FormGroup className="col-md-12">
                                        <label htmlFor="label">Variation Label</label>
                                        <Input id="label" type="text" onChange={(e) => setVariationLabel(e.target.value)} />
                                    </FormGroup>

                                    <FormGroup className="col-md-12">
                                        <label htmlFor="value">Manufacturer</label>
                                        <Input id="value" type="text" onChange={(e) => setVariationValue(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup className="col-md-12">
                                        <label htmlFor="value">Date From</label>
                                        <Input id="allocation_date" defaultValue={datefrom} type="date" onChange={(e) =>fetchDataBaseDate(e.target.value)} />
                                    </FormGroup>
                                </Col>
                            </Col>
                            <Col md={6}>
                                <Col xs={12}>
                                    <FormGroup className="col-md-12">
                                        <label htmlFor="label">Branch</label>
                                        <Input id="label" type="text" onChange={(e) => setVariationLabel(e.target.value)} />
                                    </FormGroup>

                                    <FormGroup className="col-md-12">
                                        <label htmlFor="value">Product</label>
                                        <Input id="value" type="text" onChange={(e) => setVariationValue(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup className="col-md-12">
                                        <label htmlFor="value">Date To</label>
                                        <Input id="allocation_date" defaultValue={dateto} type="date" onChange={(e) =>fetchDataBaseDate(e.target.value)} />
                                    </FormGroup>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>

            <div className="modal-footer">
                <div className="ml-auto">
                    <Button color="secondary" type="button" className="btn-round" size="md" onClick={() => setModalAddModifier(false)}> 
                        Cancel
                    </Button>
                    <span> </span>
                    <Button color="success" type="button" className="btn-round" size="md" onClick={() => AddVariation()}> 
                        Submit
                    </Button>
                </div>
            </div>
      </Modal>

        <Modal isOpen={modalAddVariation}  className="modal-md" modalClassName="bd-example-modal-lg" centered>
            <div className="modal-header">
                <h3 className="modal-title" id="myLargeModalLabel">New Variation</h3>
            </div>

            <div className="modal-body">
                <div className="row">
                    <div className="container">
                        <div className="form-row">
                            <Col md={12}>
                                <FormGroup className="col-md-12">
                                    <label htmlFor="label">Variation Label</label>
                                    <Input id="label" type="text" onChange={(e) => setVariationLabel(e.target.value)} />
                                </FormGroup>

                                <FormGroup className="col-md-12">
                                    <label htmlFor="value">Percent Value</label>
                                    <Input id="value" type="text" onChange={(e) => setVariationValue(e.target.value)} />
                                </FormGroup>
                            </Col>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-footer">
                <div className="ml-auto">
                    <Button color="secondary" type="button" className="btn-round" size="md" onClick={() => setModalAddVariation(false)}> 
                        Cancel
                    </Button>
                    <span> </span>
                    <Button color="success" type="button" className="btn-round" size="md" onClick={() => AddVariation()}> 
                        Submit
                    </Button>
                </div>
            </div>
      </Modal>

      <Modal isOpen={variationModal} className="modal-lg" modalClassName="bd-example-modal-lg" toggle={() => setVariationModal(false)} centered>            
            <Row>
              <Col xs={12}>
                <Card>
                    <CardHeader className="justify-content-between align-items-center md-3">
                        <Navbar className="justify-content-between" expand="lg" color="light">
                            <div className="px-2 text-center">
                                <h3 className="modal-title">
                                    Variation
                                </h3>
                            </div>
                            <div className="px-2">
                                <Button color="info" type="button" className="btn-round" onClick={() => setModalAddVariation(true)}>
                                    <i className="now-ui-icons ui-1_simple-add" /> New Variation
                                </Button>
                            </div>
                        </Navbar>
                    </CardHeader>
                  <CardBody>
                    <DataTableExtensions columns={variations} data={Variation}>
                        <DataTable 
                            responsive={true}
                            pagination 
                            columns={variations} 
                            data={Variation}
                            highlightOnHover
                            progressPending={pending}
                        />
                        </DataTableExtensions>
                  </CardBody>
                </Card>
              </Col>
            </Row>
      </Modal>
    </>
  );
}

export default Variation;
