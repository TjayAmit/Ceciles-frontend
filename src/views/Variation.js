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
import { PolarAreaController } from "chart.js";

function Variation() {
  const [Variation, setVariation] = useState([])
  const [modifier, setModifier] = useState([])

  const [warning, setWarning] = useState('');
  const [warningmodal, setWarningModal] = useState(false);

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
  
  //Product Table
  const [productdata,setProductData] = useState([]);
  const [productlistModal,setProductListModel] = useState(false);

  //Branch Table  
  const [branchdata,setBranchData] = useState([]);
  const [branchlistModal,setBranchListModel] = useState(false);

  //Manufacturer Table  
  const [manufacturerdata,setManufacturerData] = useState([]);
  const [manufacturerlistModal,setManufacturerListModel] = useState(false);

  //Variation Table
  const [variationlistModal,setVariationListModel] = useState(false);

  //state for form inputs 
  const [productlabel,setProductLabel] = useState('');
  const [variationlabel,setVariateLabel] = useState('');
  const [manufacturerlabel,setManufacturerLabel] = useState('');
  const [branchlabel,setBranchLabel] = useState('');

  //variable for add modifiers
  const [productID,setProductID] = useState('');
  const [variationID,setVariateID] = useState('');
  const [manufacturerID,setManufacturerID] = useState('');
  const [branchID, setBranchID] = useState('');

  const retrieveProductList = async() => {
    await axios.get(`http://localhost:5000/ceciles/products/all`).
    then((response) => {
      if(response.data.success == 1){
        setProductData(response.data.data)
      }
      if(response.data.success == -1){
          setWarning('Something went wrong')
      }
      if(response.data.success == 0){
        setWarning('Something went wrong')
      }
    });
  }
  
  const retrieveBranchList = async() => {
    await axios.get(`http://localhost:5000/ceciles/branches/alltw`).
    then((response) => {
      if(response.data.success == 1){
        setBranchData(response.data.data)
      }
      if(response.data.success == -1){
          setWarning('Something went wrong')
      }
      if(response.data.success == 0){
        setWarning('Something went wrong')
      }
    });
  }

  const retrieveVariation = async() => {
    await axios.get("http://localhost:5000/ceciles/variations/all").
    then((response) => {
        if(response.data.success == 0){
            setWarning('Someting happen while retrieving variations');
            setWarningModal(true);
        }
        if(response.data.success == -1){
            setWarning('Someting happen while retrieving variations');
            setWarningModal(true);
        }
        if(response.data.success == 1){
            setVariation(response.data.data);
        }
    })
  }

  const retrieveModifier = async() => {
    axios.get(`http://localhost:5000/ceciles/modifiers/all`).
      then((response) => {
          if(response.data.success == -1 && response.data.success == 0){
            setWarning('Something went wrong while fetching modifiers');
            setWarningModal(true);
          }
          if(response.data.success == 1){
            setModifier(response.data.data);
          }
      });
  }

  const retrieveManufacturer = async() => {
    await axios.get("http://localhost:5000/ceciles/products/manufacturer").
    then((response) => {
        if(response.data.success == -1){
            setWarning = 'Someting happen while retrieving manufacturer'
        }
        if(response.data.success == 1){
            setManufacturerData(response.data.data);
        }
    })
  }

  const openVariationModal = () => {
    setVariationModal(true);
  }

  // Function
  const AddVariation = () => {
    if(variation_label != '' && variation_value !=''){
        axios.post("http://localhost:5000/ceciles/variations/",{
            label:variation_label,
            value:variation_value,
          }).then((response) =>{
            if(response.data.success == 1){
                setModalAddVariation(false);
                retrieveVariation();
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

  const DeleteModifier = (id) => {
    axios.delete(`http://localhost:5000/ceciles/modifiers/${id}`)
    .then((response) =>{
        if(response.data.success == 1){
          retrieveModifier();
        } else {
            console.log(response.data);
        }
    });
    setModalAddVariation(false);
  }

  // Function
  const AddModifier = () => {
    if(productID != '' && branchID !='' && variationID != '' && manufacturerID !='' ){
        axios.post("http://localhost:5000/ceciles/modifiers/",{
            product_id:productID,
            branch_id:branchID,
            variation_id:variationID,
            principal_id:manufacturerID,
            date_from:datefrom,
            date_to:dateto
          }).then((response) =>{
            if(response.data.success == 1){
                retrieveModifier();
                defaultModiVariable();
                setModalAddModifier(false);
            } else {
                console.log(response.data.message);
            }
        });
    }
  }

  const defaultModiVariable = () => {
    setProductID('');
    setManufacturerID('');
    setBranchID('');
    setVariateID('');
    setProductLabel('');
    setManufacturerLabel('');
    setBranchLabel('');
    setVariateLabel('');
    setDateTo('');
    setDateFrom('');
  }

  const selectedProduct = (row) => {
    setProductID(row.product_id);
    setProductLabel(row.product_name);
    setProductListModel(false);
  }

  const selectedBranch = (row) => {
    setBranchID(row.branch_id);
    setBranchLabel(row.branch_name);
    setBranchListModel(false);
  }

  const selectedVariation = (row) => {
    setVariateID(row.variation_id);
    setVariateLabel(row.variation_label);
    setVariationListModel(false);
  }

  const selectedManufacturer = (row) => {
      setManufacturerID(row.principal_id);
      setManufacturerLabel(row.principal_name);
      setManufacturerListModel(false);
  }
  
  const setAllProduct = () => {
    setProductID('ALL')
    setProductLabel('ALL')
    setProductListModel(false)
  }

  const setAllBranch = () => {
    setBranchID('ALL')
    setBranchLabel('ALL')
    setBranchListModel(false);
  }

  const setALLManufacturer = () => {
    setManufacturerID('ALL')
    setManufacturerLabel('ALL')
    setManufacturerListModel(false)
  }

  const setALLVariation = () => {
    setVariateID('ALL')
    setVariateLabel('ALL')
    setVariationListModel(false)
  }

  useEffect(() => {
    retrieveModifier();
    retrieveVariation();
    retrieveProductList();
    retrieveBranchList();
    retrieveManufacturer();

    const timeout = setTimeout(() => {
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);

  },[])

  const variations = [
      {
        name:'ID',
        cell: (row,index) => row.variation_id,
        selector: (row,index) => row.variation_id,
        sortable:true,
        width:'8%'
      },
      {
        name:'Variation Label',
        cell: row => row.variation_label,
        selector: row => row.variation_label,
        sortable:true,
        width:"30%"
      },
      {
        name:'Percent',
        cell: row => row.variation_value,
        selector: row => row.variation_value,
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

  const manufacturerlist = [
    {
        name: 'Principal ID',
        cell: row => row.principal_id,
        selector: row => row.principal_id,
        sortable: true,
    },

    {
        name: 'Principal Name',
        cell: row => row.principal_name,
        selector: row => row.principal_name,
        sortable: true,
    },
    {
      cell: row => <Button color="success" type="button" className="btn-round" onClick={() => selectedManufacturer(row)}>Select</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      selectableRows: true,
    },
  ]

  const productlist = [
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
      name: 'UOM',
      cell: row => row.uom,
      selector: row => row.uom,
      sortable: true,
    },
    {
      name: 'UOM Value',
      cell: row => row.uom_value,
      selector: row => row.uom_value,
      sortable: true,
    },
    {
      cell: row => <Button color="success" type="button" className="btn-round" onClick={() => selectedProduct(row)}>Select</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      selectableRows: true,
    },
  ]
  
  const branchlist = [
    {
        name: 'Branch ID',
        cell: row => row.branch_id,
        selector: row => row.branch_id,
        sortable: true,
    },
    {
        name: 'Branch Name',
        cell: row => row.branch_name,
        selector: row => row.branch_name,
        sortable: true,
    },
    {
      cell: row => <Button color="success" type="button" className="btn-round" onClick={() => selectedBranch(row)}>Select</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      selectableRows: true,
    },
  ]

  const variations2 = [
    {
      name:'ID',
      cell: (row,index) => row.variation_id,
      selector: (row,index) => row.variation_id,
      sortable:true,
      width:'8%'
    },
    {
      name:'Variation Label',
      cell: row => row.variation_label,
      selector: row => row.variation_label,
      sortable:true,
      width:"30%"
    },
    {
      name:'Percent',
      cell: row => row.variation_value,
      selector: row => row.variation_value,
      sortable:true,
    },
    {
      cell: row => <Button color="success" type="button" className="btn-round" onClick={() => selectedVariation(row)}>Select</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      selectableRows: true,
    },
]

  const columns = [
    {
        name: 'ID',
        cell:  (row, index) => row.modifier_id,
        selector:  (row, index) => row.modifier_id,
        sortable: true,
        width:'8%'
    },
    {
        name: 'Label',
        cell: row => row.variation_label,
        selector: row => row.variation_label,
        sortable: true,
    },
    {
        name: 'Value',
        cell: row => row.variation_value,
        selector: row => row.variation_value,
        sortable: true,
    },
    {
        name: 'Date From',
        cell: row => row.date_from,
        selector: row => row.date_from,
        sortable: true,
    },
    {
        name: 'Date To',
        cell: row => row.date_to,
        selector: row => row.date_to,
        sortable: true,
    },
    {
        name: 'Branch',
        cell: row => row.branch,
        selector: row => row.branch,
        sortable: true,
    },
    {
        name: 'Principal ID',
        cell: row => row.principal,
        selector: row => row.principal,
        sortable: true,
    },
    {
        name: 'Product ID',
        cell: row => row.product,
        selector: row => row.product,
        sortable: true,
    },
    {
      name: 'Action',
      cell: row => <Button color="danger" type="button" className="btn-round" onClick={() => DeleteModifier(row.modifier_id) }>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      selectableRows: true,
    },
  ]

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue"></div>
        <div className="container"> </div>
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
                                    <Button color="secondary" type="button" className="btn-round" size="md" onClick={() => openVariationModal()}> 
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
                                        <Input id="label" type="text" value={variationlabel} />
                                    </FormGroup>

                                    <FormGroup className="col-md-12">
                                        <label htmlFor="value">Manufacturer</label>
                                        <Input id="value" type="text" value={manufacturerlabel} />
                                    </FormGroup>
                                    <FormGroup className="col-md-12">
                                        <label htmlFor="value">Date From</label>
                                        <Input id="allocation_date" defaultValue={datefrom} type="date" onChange={(e) => setDateFrom(e.target.value)} />
                                    </FormGroup>
                                </Col>
                            </Col>
                            <Col md={6}>
                                <Col xs={12}>
                                    <FormGroup className="col-md-12">
                                        <label htmlFor="label">Branch</label>
                                        <Input id="label" type="text" value ={branchlabel} />
                                    </FormGroup>

                                    <FormGroup className="col-md-12">
                                        <label htmlFor="value">Product</label>
                                        <Input id="value" value={productlabel} type="text" />
                                    </FormGroup>
                                    <FormGroup className="col-md-12">
                                        <label htmlFor="value">Date To</label>
                                        <Input id="allocation_date" defaultValue={dateto} type="date" onChange={(e) => setDateTo(e.target.value)} />
                                    </FormGroup>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
            <div className="modal-footer">
                <Row xs={2} md={12}>
                    <Col md={8}>
                        <Row xs={4} md={12} className="mr-auto">
                            <Col md={3}  className="ml-auto">
                                <Button color="info" type="button" className="btn-round" size="md" onClick={() => setVariationListModel(true)}>Variation</Button>
                            </Col>
                            <Col md={3}  className="ml-auto">
                                <Button color="info" type="button" className="btn-round" size="md" onClick={() => setManufacturerListModel(true)}>Manufacturer</Button>
                            </Col>
                            <Col md={3}>
                                <Button color="info" type="button" className="btn-round" size="md" onClick={() => setBranchListModel(true)}>Branch</Button>
                            </Col>
                            <Col md={3}>
                                <Button color="info" type="button" className="btn-round" size="md" onClick={() => setProductListModel(true)}>Product</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <Row xs={2}  className="ml-auto">
                            <Col md={5}>
                                <Button color="secondary" type="button" className="btn-round" size="md" onClick={() => setModalAddModifier(false)}> 
                                    Cancel
                                </Button>
                            </Col>
                            <Col md={5} className="md-auto">
                                <Button color="success" type="button" className="btn-round" size="md" onClick={() => AddModifier()}> 
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
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

    <Modal isOpen={productlistModal}  className="modal-lg" modalClassName="bd-example-modal-lg" toggle={() => setProductListModel(false)} centered>
        <div className="content">
          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  <Navbar expand="lg" className="py-2" color="light">
                      <h4>Product Master List</h4>
                    <Collapse navbar>
                        <Form inline className="ml-auto">
                            <Button color="info" type="button" className="btn-round" size="md" onClick={() => setAllProduct()}> 
                               All Product
                            </Button>
                        </Form>
                    </Collapse>
                  </Navbar>
                </CardHeader>

                <CardBody>
                  <DataTableExtensions columns={productlist} data={productdata}>
                    <DataTable 
                      responsive
                      pagination 
                      columns={productlist} 
                      data={productdata} 
                      progressPending={pending}
                    />
                  </DataTableExtensions>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    </Modal>

    
    <Modal isOpen={branchlistModal}  className="modal-lg" modalClassName="bd-example-modal-lg" toggle={() => setBranchListModel(false)} centered>
        <div className="content">
          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  <Navbar expand="lg" className="py-2" color="light">
                      <h4>Branch List</h4>
                      
                    <Collapse navbar>
                        <Form inline className="ml-auto">
                            <Button color="info" type="button" className="btn-round" size="md" onClick={() => setAllBranch()}> 
                               All Branch
                            </Button>
                        </Form>
                    </Collapse>
                  </Navbar>
                </CardHeader>

                <CardBody>
                  <DataTableExtensions columns={branchlist} data={branchdata}>
                    <DataTable 
                      responsive
                      pagination 
                      columns={branchlist} 
                      data={branchdata} 
                      progressPending={pending}
                    />
                  </DataTableExtensions>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    </Modal>
    
    <Modal isOpen={variationlistModal}  className="modal-lg" modalClassName="bd-example-modal-lg" toggle={() => setVariationListModel(false)} centered>
        <div className="content">
          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  <Navbar expand="lg" className="py-2" color="light">
                      <h4>Variation List</h4>
                  </Navbar>
                </CardHeader>

                <CardBody>
                  <DataTableExtensions columns={variations2} data={Variation}>
                    <DataTable 
                      responsive
                      pagination 
                      columns={variations2} 
                      data={Variation} 
                      progressPending={pending}
                    />
                  </DataTableExtensions>
               
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    </Modal>

    
    <Modal isOpen={manufacturerlistModal}  className="modal-lg" modalClassName="bd-example-modal-lg" toggle={() => setManufacturerListModel(false)} centered>
        <div className="content">
          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  <Navbar expand="lg" className="py-2" color="light">
                      <h4>Manufacturer List</h4>
                      
                    <Collapse navbar>
                        <Form inline className="ml-auto">
                            <Button color="info" type="button" className="btn-round" size="md" onClick={() => setALLManufacturer()}> 
                              All Manufacturer
                            </Button>
                        </Form>
                    </Collapse>
                  </Navbar>
                </CardHeader>

                <CardBody>
                  <DataTableExtensions columns={manufacturerlist} data={manufacturerdata}>
                    <DataTable 
                      responsive
                      pagination 
                      columns={manufacturerlist} 
                      data={manufacturerdata} 
                      progressPending={pending}
                    />
                  </DataTableExtensions>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    </Modal>

    <Modal isOpen={warningmodal} className="modal-md" modalClassName="bd-example-modal-lg" toggle={() => setWarningModal(true)} centered>
      <div className="modal-header    ">
          </div>
          <div className="modal-body">
            <div className="row">
                <div className="container">
                    <div className="form-row">
                        <Col md={12}>
                            <FormGroup className="col-md-12">
                                <h4>{warning}</h4>
                            </FormGroup>
                        </Col>
                    </div>
                </div>
            </div>
          </div>
          <div className="modal-footer">
              <div className="ml-auto">
                  <Button className="btn-round" color="info" size="lg" onClick={() => setWarningModal(true) }>Close</Button>
              </div>
          </div>
      </Modal>
    </>
  );
}

export default Variation;
