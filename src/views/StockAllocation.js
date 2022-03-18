import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useDropzone } from "react-dropzone"
import DataTable from "react-data-table-component"
import DataTableExtensions from 'react-data-table-component-extensions';
import "react-data-table-component-extensions/dist/index.css";  
import axios from "axios"

// reactstrap components
import { Card,
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
        Spinner}
from "reactstrap"
import { createPortal } from "react-dom";
import { BarController } from "chart.js";

function StockAllocation(props) {
  const [branches, setBranches] = useState([])

  const [item, setItem] = useState([])
  const [branchname, setBranchName] = useState('')

  const [summaryallocation, setSummaryAllocation] = useState([])
  const [summaryModalView, setSummaryModalView] = useState(false)

  const [saveallolabel, setSaveAlloLabel] = useState('Saving Allocation...')
  const [saveallofeedback,setSaveAlloFeedback] = useState(false)


  const [editSugID,setEditSugID] = useState('')
  const [editPID,setEditPID] = useState('')
  const [editPN,setEditPN] = useState('')
  const [editSA,setEditSA] = useState('')
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

  function saveAllocationForDistribution() {
    return axios.post("http://localhost:5000/ceciles/allocations/saveallocation")
   }

  const saveAllocation = async () => {
    setSaveAlloFeedback(true)
    const allocation_result = saveAllocationForDistribution()
    setTimeout(() => {
      setSaveAlloLabel('Allocation successfully save')
		}, 1000);
  }

  const defaultSaveAllocation = () => {
    setSaveAlloFeedback(false)
    setSaveAlloLabel('Saving Allocation...')
  }

  async function getAllocationSummary(){
    return axios.get("http://localhost:5000/ceciles/allocations/as")
  }

  const viewAllocationSummary = async () =>{

    const summaryallocation_items = await getAllocationSummary()
    setSummaryAllocation(summaryallocation_items.data.data)
    setSummaryModalView(true)
  }

  const rowDelete = (suggested_id) => {
      axios.post("http://localhost:5000/ceciles/allocations/delete",{
          suggested_id,
      })
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
    setEditSA(row.suggested_allocation_quantity)
    setEditPercent(row.percentage_quantity)
    setModalEditVariation(true)
    setModalView(false)
  }

  const updateStockVariation = () => {
    axios.put("http://localhost:5000/ceciles/allocations/",{
        editSugID,
        editPID,
        editSA,
      }).then((response) =>{
        if(response.data.success == 1){
          viewBranch(branchname)
          setModalEditVariation(false);
        } else {
            console.log("response.data.message");
        }
    });
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
        sortable: true,
        width: '10%',
        ignoreRowClick: false,
    },
    {
        name: 'Branch Name',
        cell: row => row.branch,
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
        sortable: true,
        width: '7%',
    },
    {
        name: 'PID',
        cell: row => row.product_id,
        width: '15%',
        sortable: true,
    },
    {
      name: 'PName',
      cell: row => row.product_name,
      width: '20%',
      sortable: true,
    },
  
    {
      name: 'AS',
      cell: row => row.available_inventory,
      sortable: true,
    },
    {
      name: 'SQ',
      cell: row => row.sold_quantity,
      sortable: true,
    },
  
    {
      name: 'UOM',
      cell: row => row.uom,
      sortable: true,
    },

    {
      name: 'Value',
      cell: row => row.uom_value,
      sortable: true,
    },
    {
      name: 'SA Qty',
      cell: row => row.suggested_allocation_quantity,
      sortable: true,
    },

    {
      name: 'Percentage',
      cell: row => row.percentage_quantity,
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
      cell: row => <Button color="danger" type="button" className="btn-round" onClick={() => rowDelete(row.suggested_id) }>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]

  const summaryitems = [
    {
        name: 'Product ID',
        cell: row => row.product_id,
        sortable: true,
    },
    {
        name: 'Product Name',
        cell: row => row.product_name,
        sortable: true,
    },
    {
        name: 'UOM',
        cell: row => row.uom,
        sortable: true,
    },
    {
        name: 'UOM Value',
        cell: row => row.uom_value,
        sortable: true,
    },
    {
        name: 'SA Summary',
        cell: row => row.total,
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
                    <Navbar expand="lg" color="info">
                      <NavbarToggler>
                          <span className="navbar-toggler-bar navbar-kebab"></span>
                          <span className="navbar-toggler-bar navbar-kebab"></span>
                          <span className="navbar-toggler-bar navbar-kebab"></span>
                      </NavbarToggler>
                      <Collapse navbar>
                          <Form inline className="ml-auto">
                            <Button color="success" type="button" className="btn-round" size="md" onClick={() => viewAllocationSummary()}> 
                                Summary Allocation
                            </Button>
                            <Button color="warning" type="button" className="btn-round" size="md" onClick={() => saveAllocation()}> 
                                Saved Allocation
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
            {branchname} Stock Allocation
          </h4>
          <button aria-label="Close" className="close" type="button" onClick={() => setModalView(false)}>
            <span aria-hidden={true}>×</span>
          </button>
        </div>

        <div className="modal-body">
          {/* {allocationItems?.map(i => {
            console.log(i)
          })} */}
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
      <Modal isOpen={summaryModalView} className="modal-xl" modalClassName="bd-example-modal-lg" toggle={() => setSummaryModalView(false)}>
        <div className="modal-header">
          <h4 className="modal-title" id="myLargeModalLabel">
            Allocation Summary
          </h4>
          <button aria-label="Close" className="close" type="button" onClick={() => setSummaryModalView(false)}>
            <span aria-hidden={true}>×</span>
          </button>
        </div>

        <div className="modal-body">
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

      {/* MODAL ADD STOCK */}
          <Modal isOpen={modalAddStock} className="modal-xl" modalClassName="bd-example-modal-lg" toggle={() => setModalAddStock(false)}>
            <div className="modal-header">
              <h4 className="modal-title" id="myLargeModalLabel">
                Add Stock
              </h4>
              <button aria-label="Close" className="close" type="button" onClick={() => setModalAddStock(false)}>
                <span aria-hidden={true}>×</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="container">
                    <div className="form-row">
                      <FormGroup className="col-md-2">
                        <label htmlFor="branch">Branch</label>
                        <Input id="branch" type="select" onChange={(e) => setBranch(e.target.value)}>
                          {branches?.map(i => {
                            return (
                              <option> {i.branch} </option>
                            )
                          })}
                        </Input>
                      </FormGroup>

                      <FormGroup className="col-md-4">
                        <label htmlFor="inputState">Product ID</label>
                        <Input id="product_id" type="text" onChange={(e) => setProductID(e.target.value)} />
                      </FormGroup>

                      <FormGroup className="col-md-3">
                        <label htmlFor="inputState">Product Name</label>
                        <Input id="product_name" type="text" onChange={(e) => setProductName(e.target.value)} />
                      </FormGroup>

                      <FormGroup className="col-md-3">
                        <label htmlFor="inputState">Suggested Allocated Quantity</label>
                        <Input id="suggested_allocation_quantity" type="number" onChange={(e) => setAllocatedQuantity(e.target.value)} />
                      </FormGroup>
                    </div>
                  </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="ml-auto">
                <Button className="btn-round" color="info" size="lg" onClick={() => AddStock() }>Add</Button>
              </div>
            </div>
          </Modal>

        <Modal isOpen={modalEditVariation} className="modal-md" modalClassName="bd-example-modal-lg">
            <div className="modal-header  ">
            <h4 className="modal-title" id="myLargeModalLabel">
                Update Product
            </h4>
            <button aria-label="Close" className="close" type="button" onClick={() => closeViewBranch()}>
                <span aria-hidden={true}>×</span>
            </button>
            </div>

            <div className="modal-body">
            <div className="row">
                <div className="container">
                    <div className="form-row">
                        <Col md={12}>
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">Allocation ID</label>
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
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">Suggested Allocation</label>
                                <Input id="label" value={editSA} type="text" onChange={(e) => setEditSA(e.target.value)} />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <label htmlFor="value">Percent</label>
                                <Input id="value" value={editPercent} type="text" />
                            </FormGroup>
                        </Col>
                    </div>
                </div>
            </div>
            </div>

            <div className="modal-footer">
                <div className="ml-auto">
                    <Button className="btn-round" color="info" size="lg" onClick={() => updateStockVariation() }>Save</Button>
                </div>
            </div>
      </Modal>

<Modal isOpen={saveallofeedback} className="modal-md" modalClassName="bd-example-modal-lg" >
    <div className="modal-header    ">
    <h4 className="modal-title" id="myLargeModalLabel">
        Saving Allocation
    </h4>
    </div>

    <div className="modal-body">
    <div className="row">
        <div className="container">
            <div className="form-row">
                <Col md={12}>
                    <FormGroup className="col-md-12">
                        <label htmlFor="label"><h4>{saveallolabel}</h4></label>
                    </FormGroup>
                </Col>
            </div>
        </div>
    </div>
    </div>

    <div className="modal-footer">
        <div className="ml-auto">
            <Button className="btn-round" color="info" size="lg" onClick={() => defaultSaveAllocation() }>Close</Button>
        </div>
    </div>
</Modal>
    </>
  );
}

export default StockAllocation;