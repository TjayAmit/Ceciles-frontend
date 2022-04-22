import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useDropzone } from "react-dropzone"
import DataTable from "react-data-table-component"
import DataTableExtensions from 'react-data-table-component-extensions';
import "react-data-table-component-extensions/dist/index.css";  
import axios from "axios"

// reactstrap components
import { 
        Card,
        CardBody,
        Row,
        Col,
        Navbar, 
        NavbarToggler,
        Collapse,
        Form, 
        FormGroup, 
        Input, 
        Button,
        CardHeader, 
        Modal, 
        CardTitle, 
        CardFooter,
        Spinner
      }
from "reactstrap"
import { createPortal } from "react-dom";
import { BarController } from "chart.js";

function StockAllocation(props) {
  const [branches, setBranches] = useState([])
  const [checkvalue, setCheckValue] = useState(false);

  const [item, setItem] = useState([])
  const [branchname, setBranchName] = useState('')

  const [summaryallocation, setSummaryAllocation] = useState([])
  const [summaryModalView, setSummaryModalView] = useState(false)

  const [saveallolabel, setSaveAlloLabel] = useState('Saving Allocation')
  const [showSpin,setShowSpin] = useState(true)
  const [saveallofeedback,setSaveAlloFeedback] = useState(false)


  const [editSugID,setEditSugID] = useState('')
  const [editPID,setEditPID] = useState('')
  const [editPN,setEditPN] = useState('')
  const [setSA,setSAValue] = useState('')
  const [setedit,setEditSAValue] = useState('')
  const [editPercent,setEditPercent] = useState('')

  //Modal
  const [modalEditVariation, setModalEditVariation] = useState(false)  
  const [rowData, setRowData] = useState()

  //Modal
  const [modalView, setModalView] = useState(false)
  const [modalAddStock, setModalAddStock] = useState(false)  

  //Loading animaition
  const [pending, setPending] = useState(true)

  // Add Stock
  const [branch, setBranch] = useState("")
  const [product_id, setProductID] = useState("")
  const [product_name, setProductName] = useState("")
  const [suggested_allocation_quantity, setAllocatedQuantity] = useState("")

  const AddStock = () => {
    axios.post("http://192.168.0.126:5000/ceciles/allocations/add",{
        branch,
        product_id,
        product_name,
        suggested_allocation_quantity,
      }).then((response) =>{
        if(response.data.success == 1){
            console.log(response.data.message);
        } else {
            console.log("response.data.message");
        }
    });
    setModalAddStock(false);
  }

  // Function
   function getItem(branch) {
    return axios.post("http://localhost:5000/ceciles/allocations/bybranches",{
          branch
      })
  }

  const changeCheckDisplay = (value) => {
    setCheckValue(value);
    if(value == true){
      axios.get("http://localhost:5000/ceciles/allocations/asw").then((response) => {
        if(response.data.success == 1){
          setSummaryAllocation(response.data.data)
        }
      });
    }else{
      axios.get("http://localhost:5000/ceciles/allocations/as").then((response) => {
        if(response.data.success == 1){
          setSummaryAllocation(response.data.data)
        }
      });
    }
  }
  
  const viewBranch = async (branches) => {
    setBranchName(branches)
    const allocation_items = getItem(branches)
    setItem((await allocation_items).data.data)
    setModalView(true)
	}

  const viewBranch2 = async() => {
    const allocation_items = getItem(branchname)
    setItem((await allocation_items).data.data)
  }

  const closeViewBranch = () => {
    setModalEditVariation(false)
    setModalView(true)
  }

  const saveAllocation = async () => {
    setSaveAlloFeedback(true)
    axios.post("http://localhost:5000/ceciles/allocations/saveallocation").then((response) => {
      if(response.data.success==1){
        setShowSpin(false)
        setSaveAlloLabel('PO successfully save')
      }
      if(response.data.success == 0){
        setShowSpin(false)
        setSaveAlloLabel('Problem occure while saving PO')
      }
      if(response.data.success == -1){
        setShowSpin(false)
        setSaveAlloLabel('Problem occure while saving PO')
      }
    })
  }

  const defaultSaveAllocation = () => {
    setTimeout(() => {
      setSaveAlloFeedback(false)
      setShowSpin(true)
      setSaveAlloLabel('Saving Allocation...')
		}, 1000);
  }

  async function getAllocationSummary(){
    return axios.get("http://localhost:5000/ceciles/allocations/as")
  }

  const viewAllocationSummary = async () =>{
    setCheckValue(false)
    const summaryallocation_items = await getAllocationSummary()
    setSummaryAllocation(summaryallocation_items.data.data)
    setSummaryModalView(true)
  }

  const rowDelete = (row) => {
      axios.delete(`http://localhost:5000/ceciles/allocations/delete/${row.suggested_id}`)
      .then((response) =>{
        if(response.data.success == 1){
          viewBranch2()
        } else {
            console.log("response.data.message");
        }
    });
  }


  const rowEdit = (row) => {
    setEditSugID(row.suggested_id)
    setEditPID(row.product_id)
    setEditPN(row.product_name)
    setSAValue(row.suggested_allocation_quantity)
    setEditSAValue(row.updated_allocation_quantity)
    setEditPercent(parseInt(row.percentage_quantity * 100) + '%')
    setModalEditVariation(true)
    setModalView(false)
  }

  const updateStockVariation = () => {
    axios.put("http://localhost:5000/ceciles/allocations/",{
        suggested_id:editSugID,
        product_id:editPID,
        updated_so:setedit,
      }).then((response) =>{
        console.log(response)
        if(response.data.success == 1){
          viewBranch(branchname)
          setModalEditVariation(false);
        } else {
            console.log("response.data.message");
        }
    });
  }

  const defaultModalVariation = () => {
    viewBranch(branchname)
    setModalEditVariation(false);
  }

  
  async function getBranches() {
    const { data: {data} } = await axios.get("http://localhost:5000/ceciles/models/listbranches")
    
    setBranches(data)
  }

  useEffect(() => {

    getBranches()

    const timeout = setTimeout(() => {
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);

  },[])

  const columns = [
    {
        name: 'ID',
        cell: (row, index) => ++index,
        selector: (row, index) => ++index,
        sortable: true,
        width: '10%',
        ignoreRowClick: false,
    },
    {
        name: 'Branch Name',
        cell: row => row.branch,
        selector: row => row.branch,
        sortable: true,
    },
    {
      name: 'Action',
      cell: row => <Button color="info" type="button" className="btn-round" onClick={() => viewBranch(row.branch) }>View</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      selectableRows: true,
    },
  ]
  
  const itm = [ 
    {
        name: 'ID',
        cell: (row, index) => row.suggested_id,
        selector: (row, index) => row.suggested_id,
        sortable: true,
        width: '7%',
    },
    {
        name: 'PID',
        cell: row => row.product_id,
        selector: row => row.product_id,
        width: '15%',
        sortable: true,
    },
    {
      name: 'PName',
      cell: row => row.product_name,
      selector: row => row.product_name,
      width: '20%',
      sortable: true,
    },
    {
      name: 'AS',
      cell: row => row.available_inventory,
      selector: row => row.available_inventory,
      sortable: true,
    },
    {
      name: 'SQ',
      cell: row => row.sold_quantity,
      selector: row => row.sold_quantity,
      sortable: true,
    },
  
    {
      name: 'UOM',
      cell: row => row.uom,
      selector: row => row.uom,
      sortable: true,
    },

    {
      name: 'Value',
      cell: row => row.uom_value,
      selector: row => row.uom_value,
      sortable: true,
    },
    {
      name: 'SO Qty',
      cell: row => row.suggested_allocation_quantity,
      selector: row =>row.suggested_allocation_quantity,
      sortable: true,
    },
    {
      name: 'Edit Qty',
      cell: row => row.updated_allocation_quantity,
      selector: row => row.updated_allocation_quantity,
      sortable: true,
    },
    {
      name: 'Percentage',
      cell: row => parseInt(row.percentage_quantity * 100) + '%',
      selector: row => row.percentage_quantity,
      sortable: true,
    },
    {
      cell: row => <Button color="success" type="button" className="btn-round" onClick={() => rowEdit(row)}>Edit</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  
    {
      name: '',
      cell: row => <Button color="danger" type="button" className="btn-round" onClick={() => rowDelete(row) }>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]

  const summaryitems = [
    {
        name: 'Product ID',
        cell: row => row.product_id,
        selector: row => row.product_id,
        sortable: true,
    },
    {
        name: 'Product Name',
        cell: row => row.product_name,
        selector: row => row.product_name,
        sortable: true,
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
        name: 'SO Summary',
        cell: row => row.total,
        selector: row => row.total,
        sortable: true,
    },
    {
        name: 'Total Price',
        cell: row => row.price,
        selector: row => row.price,
        sortable: true,
    },
  ]

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue"> </div>
          <div className="content">
            <Row>
              <Col xs={12}>
                <Card>
                  <CardHeader>
                    <Navbar expand="lg" color="light">
                      <NavbarToggler>
                          <span className="navbar-toggler-bar navbar-kebab"></span>
                          <span className="navbar-toggler-bar navbar-kebab"></span>
                          <span className="navbar-toggler-bar navbar-kebab"></span>
                      </NavbarToggler>
                      <Collapse navbar>
                          <Form inline className="ml-auto" md={12}>
                            <Button color="info" type="button" className="btn-round" size="md" onClick={() => viewAllocationSummary()}> 
                                View Summary
                            </Button>
                            <Button color="secondary" type="button" className="btn-round" size="md" onClick={() => saveAllocation()}> 
                                Save Suggested Order
                            </Button>
                          </Form>
                      </Collapse>
                    </Navbar>
                  </CardHeader>

                  <CardBody>
                  <DataTableExtensions columns={columns} data={branches}>
                      <DataTable 
                        responsive={true}
                        pagination 
                        columns={columns} 
                        data={branches}
                        highlightOnHover
                        progressPending={pending}
                      />
                    </DataTableExtensions>
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </div>
      {/* </div> */}
      {/* MODAL  VIEW*/}
      <Modal isOpen={modalView} className="modal-xl" modalClassName="bd-example-modal-lg" toggle={() => setModalView(false)}>
        <div className="modal-header">
          <h4 className="modal-title" id="myLargeModalLabel">
            {branchname} Suggested Order
          </h4>
          <button aria-label="Close" className="close" type="button" onClick={() => setModalView(false)}>
            <span aria-hidden={true}>×</span>
          </button>
        </div>

        <div className="modal-body">
          <DataTableExtensions columns={itm} data={item}>
            <DataTable 
              responsive
              pagination
              columns={itm} 
              data={item}
              highlightOnHover
              pointerOnHover
            />
          </DataTableExtensions>
        </div>
      </Modal>

      
      {/* MODAL  VIEW*/}
      <Modal isOpen={summaryModalView} className="modal-xl" modalClassName="bd-example-modal-lg">
        <div className="modal-header" >
              <h3 className="modal-title" id="myLargeModalLabel">
                Suggested Order Summary
              </h3>
            <button aria-label="Close" className="close" type="button" onClick={() => setSummaryModalView(false)}>
              <span aria-hidden={true}>×</span>
            </button>
        </div>

        <div className="modal-body">
          <Col >
              <Input type="checkbox" checked={checkvalue} onChange={(e) => changeCheckDisplay(e.target.checked)} />
              <label htmlFor="label">Hide Zero Value (SO Summary)</label> 
          </Col>
          <DataTableExtensions columns={summaryitems} data={summaryallocation}>
            <DataTable 
              responsive
              pagination
              columns={summaryitems} 
              data={summaryallocation}
              highlightOnHover
              pointerOnHover
            />
          </DataTableExtensions>
        </div>
      </Modal>

        <Modal isOpen={modalEditVariation} className="modal-lg" modalClassName="bd-example-modal-lg" centered>
              <h4 className="modal-title px-4" id="myLargeModalLabel">
                  Update Product
              </h4>
            <div className="modal-body">
              <Form>
                  <div className="container">
                      <Row xs={2}>
                          <Col md={6}>
                              <FormGroup className="col-md-12">
                                  <label htmlFor="label">Suggested order ID</label>
                                  <Input id="label" value={editSugID} type="text" />
                              </FormGroup>
                              <FormGroup className="col-md-12">
                                  <label htmlFor="label">Porduct ID</label>
                                  <Input id="label" value={editPID} type="text" />
                              </FormGroup>
                              <FormGroup className="col-md-12">
                                  <label htmlFor="value">Product Name</label>
                                  <Input id="value" value={editPN} type="text" />
                              </FormGroup>
                          </Col>
                          <Col md={6}>
                              <FormGroup className="col-md-12">
                                  <label htmlFor="value">Percent</label>
                                  <Input id="value" value={editPercent} type="text" />
                              </FormGroup>
                              <FormGroup className="col-md-12">
                                  <label htmlFor="label">Suggested order</label>
                                  <Input id="label" value={setSA} type="text" />
                              </FormGroup>
                              <FormGroup className="col-md-12">
                                  <label htmlFor="label">New Suggested order</label>
                                  <Input id="label" value={setedit} type="text" onChange={(e) => setEditSAValue(e.target.value)} />
                              </FormGroup>
                          </Col>
                      </Row>
                  </div>
              </Form>
            </div>

            <div className="modal-footer">
                <div className="ml-auto">
                    <Button className="btn-round" color="secondary" size="md" onClick={() => defaultModalVariation() }>Cancel</Button>
                    <span> </span>
                    <Button className="btn-round" color="success" size="md" onClick={() => updateStockVariation() }>Submit</Button>
                </div>
            </div>
      </Modal>
      
      <Modal isOpen={saveallofeedback} className="modal-md" modalClassName="bd-example-modal-lg" centered>
          <div className="modal-header    ">
            <h4 className="modal-title" id="myLargeModalLabel"></h4>
          </div>

          <div className="modal-body">
          <div className="row">
              <div className="container">
                  <div className="form-row">
                      <Col md={12}>
                          <FormGroup className="col-md-12">
                            {showSpin?<Spinner />:null}<label className="py-3 px-md-3" htmlFor="label"><h4>{saveallolabel}</h4></label>
                          </FormGroup>
                      </Col>
                  </div>
              </div>
          </div>
          </div>

          <div className="modal-footer">
              <div className="ml-auto">
                  <Button className="btn-round" color="info" size="md" onClick={() => defaultSaveAllocation() }>Close</Button>
              </div>
          </div>
      </Modal>
    </>
  );
}

export default StockAllocation;
