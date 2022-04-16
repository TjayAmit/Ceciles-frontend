import React, { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import DataTable from "react-data-table-component"
import DataTableExtensions from "react-data-table-component"

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
} from "reactstrap"

import axios from "axios"
import { convertToObject } from "typescript"

function BranchTable() {
  const [pending, setPending] = React.useState(true); 
  const [branch, setBranch] = useState([])

  const [item,setItem] = useState([]);
  const [branchname,setbranchName] = useState('');
  const [modalView,setModalView] = useState(false);

  const [actionLabel,setActionLabel] = useState('')
  const [updateaction,setUpdateAction] = useState(false);
  const [addaction,setAddAction] = useState(false);

  const [editBranchID,setBranchID] = useState('')
  const [editBranchName,setBranchName] = useState('')
  const [editInTCode,setIntCode] = useState('')
  const [editInTName,setInTName] = useState('')
  const [editWHCode,setWHCode] = useState('')
  const [editWHName,setWHName] = useState('')

  //Modal
  const [modalEditVariation, setModalEditVariation] = useState(false)  

  const closeModal = () => {
    setModalEditVariation(false)
    defaultState()
  }

  const rowEdit = (row) => {
    setBranchID(row.branch_id)
    setBranchName(row.branch_name)
    setIntCode(row.In_Transit_WH_code)
    setInTName(row.In_Transit_WH_Name)
    setWHCode(row.Warehouse_Code)
    setWHName(row.Warehouse_Name)
    setAddAction(false)
    setActionLabel("Update Branch")
    setModalEditVariation(true)
    setUpdateAction(true)
  }

  const rowAddBranch = () => {
    setActionLabel('New Branch')
    setModalEditVariation(true)
    setAddAction(true)
  }

  const defaultState = () => {
    setBranchID('')
    setBranchName('')
    setIntCode('')
    setInTName('')
    setWHCode('')
    setWHName('')
    setUpdateAction(false)
    setUpdateAction(false)
    setAddAction(true)
  }

  const addBranchData = () => {
    axios.post("http://localhost:5000/ceciles/branches/",{
        branch_id:editBranchID,
        branch_name:editBranchName,
        In_Transit_WH_code:editInTCode,
        In_Transit_WH_Name:editInTName,
        Warehouse_Code:editWHCode,
        Warehouse_Name:editWHName,
      }).then((response) =>{
        if(response.data.success == 1){
          getBranch()
          setModalEditVariation(false);
          defaultState();
          setAddAction(false)
        } else {
            console.log("response.data.message");
        }
    });
  }

  const updateBranchData = () => {
    axios.put("http://localhost:5000/ceciles/branches/",{
        branch_id:editBranchID,
        branch_name:editBranchName,
        In_Transit_WH_code:editInTCode,
        In_Transit_WH_Name:editInTName,
        Warehouse_Code:editWHCode,
        Warehouse_Name:editWHName,
      }).then((response) =>{
        if(response.data.success == 1){
          getBranch()
          setModalEditVariation(false);
          defaultState();
        } else {
            console.log("response.data.message");
        }
    });
  }

  const rowDelete = (id) => {
    axios.delete(`http://localhost:5000/ceciles/branches/${id}`).then((response) => {
      if(response.data.success == 1){
        getBranch()
        console.log('Branch Deleted')
      }
    })
  }

  const viewInventory = async(name) => {
    setbranchName(name)
    setModalView(true);
      axios.post(`http://localhost:5000/ceciles/branches/getinventory`,{
          branch:name
      }).then((response) => {
        if(response.data.success == 1){
          setItem(response.data.data);
        }
      }); 
  }

  const columns = [
    {
        name: 'Branch ID',
        cell: row => row.branch_id,
        selector: row => row.branch_id,
        sortable: true,
    },
    {
        name: 'Name',
        cell: row => row.branch_name,
        selector: row => row.branch_name,
        sortable: true,
    },
    {
        name: 'In Transit code',
        cell: row => row.In_Transit_WH_code,
        selector: row => row.In_Transit_WH_code,
        sortable: true,
    },
    {
        name: 'In Transit Name',
        cell: row => row.In_Transit_WH_Name,
        selector: row => row.In_Transit_WH_Name,
        sortable: true,
        width:'17%'
    },
    {
        name: 'Warehouse Code',
        cell: row => row.Warehouse_Code,
        selector: row => row.Warehouse_Code,
        sortable: true,
    },
    {
        name: 'Warehouse Name',
        cell: row => row.Warehouse_Name,
        selector: row => row.Warehouse_Name,
        sortable: true,
        width:'17%'
    },
    {
      cell: row => <Button color="info" type="button" className="btn-round" onClick={() => viewInventory(row.branch_name)}>Inventory</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      selectableRows: true,
      width:'10%'
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
      cell: row => <Button color="danger" type="button" className="btn-round" onClick={() => rowDelete(row.branch_id) }>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]
  
  const itm = [
    {
        name: 'ID',
        cell: row => row.inventory_id,
        selector: row => row.inventory_id,
        sortable: true,
        width:'10%'
    },
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
        width:'30%'
    },
    {
        name: 'Stock',
        cell: row => row.quantity,
        selector: row => row.quantity,
        sortable: true,
        width:'10%'
    },
    {
        name: 'Inventory Date',
        cell: row => row.inventory_date,
        selector: row => row.inventory_date,
        sortable: true,
        width:'17%'
    },
    {
      cell: row => <Button color="success" type="button" className="btn-round" onClick={() => rowEdit(row.inventory_id)}>Edit</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      selectableRows: true,
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

  async function getBranch() {
    const { data: {data} } = await axios.get("http://localhost:5000/ceciles/branches/all")
    setBranch(data);
  }

  useEffect(() => {
    getBranch()

    const timeout = setTimeout(() => {
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);
  },[])

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
                          <Button color="info" type="button" className="btn-round" size="md" onClick={() => rowAddBranch()}> 
                          <i className="now-ui-icons ui-1_simple-add" /> New Branch
                          </Button>
                        </Form>
                    </Collapse>
                </Navbar>
              </CardHeader>
              <CardBody>
                <DataTableExtensions columns={columns} data={branch}>
                  <DataTable 
                    responsive={true}
                    pagination 
                    highlightOnHover
                    columns={columns} 
                    data={branch}
                  />
                </DataTableExtensions>
              </CardBody>
            </Card>
          </Col>
        </Row>
        </div>
        
      {/* MODAL  VIEW*/}
      <Modal isOpen={modalView} className="modal-xl" modalClassName="bd-example-modal-lg" toggle={() => setModalView(false)}>
        <div className="modal-header">
          <h4 className="modal-title" id="myLargeModalLabel">
            {branchname} Inventory
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

        <Modal isOpen={modalEditVariation} className="modal-lg" modalClassName="bd-example-modal-lg" toggle={() => closeModal(false)}>
            <h4 className="modal-title px-4">
                {actionLabel}
            </h4>

            <div className="modal-body">
            <Form>
                <div className="container">
                    <Row xs = {2}>
                        <Col md={6}>
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">ID</label>
                                <Input id="label" value={editBranchID} type="text"  onChange={(e) => addaction? setBranchID(e.target.value):null} />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">Branch Name</label>
                                <Input id="label" value={editBranchName} type="text"  onChange={(e) => setBranchName(e.target.value)} />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">In Transit Code</label>
                                <Input id="label" value={editInTCode} type="text"  onChange={(e) => setIntCode(e.target.value)} />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="col-md-12">
                                <label htmlFor="value">In Transit</label>
                                <Input id="value" value={editInTName} type="text"  onChange={(e) => setInTName(e.target.value)}/>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <label htmlFor="label">Warehouse Code </label>
                                <Input id="label" value={editWHCode} type="text" onChange={(e) => setWHCode(e.target.value)} />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <label htmlFor="value">Warehouse Name</label>
                                <Input id="value" value={editWHName} type="text"  onChange={(e) => setWHName(e.target.value)}/>
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
            </Form>
            </div>

            <div className="modal-footer">
              <div className="ml-auto">
                <Button className="btn-round" color="secondary" size="md" onClick={() => setModalEditVariation(false) }>Cancel</Button>
                <span> </span>
                {
                  updateaction?
                  <Button className="btn-round" color="success" size="md" onClick={() => updateBranchData() }>Submit</Button>:null
                }
                {
                  addaction? 
                  <Button className="btn-round" color="success" size="md" onClick={() => addBranchData() }>Submit</Button>:null
                }
              </div>
            </div>
      </Modal>
    </>
  );
}

export default BranchTable;
