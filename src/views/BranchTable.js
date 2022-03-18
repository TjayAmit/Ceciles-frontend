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

function BranchTable() {
  const [pending, setPending] = React.useState(true); 
  const [branch, setBranch] = useState([])

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
    setAddAction(false)
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
            console.log(response.data.message);
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
            console.log(response.data.message);
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

  const columns = [
    {
        name: 'Branch ID',
        selector: row => row.branch_id,
        sortable: true,
    },
    {
        name: 'Branch Name',
        selector: row => row.branch_name,
        sortable: true,
    },
    {
        name: 'In Transit code',
        selector: row => row.In_Transit_WH_code,
        sortable: true,
    },
    {
        name: 'In Transit Name',
        selector: row => row.In_Transit_WH_Name,
        sortable: true,
    },
    {
        name: 'Warehouse Code',
        selector: row => row.Warehouse_Code,
        sortable: true,
    },
    {
        name: 'Warehouse Name',
        selector: row => row.Warehouse_Name,
        sortable: true,
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
              <Navbar expand="lg" color="info">
                    <NavbarToggler>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                        <span className="navbar-toggler-bar navbar-kebab"></span>
                    </NavbarToggler>
                    <Collapse navbar>
                        <Form inline className="ml-auto">
                          <Button color="warning" type="button" className="btn-round" size="md" onClick={() => rowAddBranch()}> 
                              Add Branch
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
        

        <Modal isOpen={modalEditVariation} className="modal-md" modalClassName="bd-example-modal-lg" toggle={() => closeModal(false)}>
            <div className="modal-header    ">
            <h3 className="modal-title" id="myLargeModalLabel">
                {actionLabel}
            </h3>
            <button aria-label="Close" className="close" type="button" onClick={() => closeModal()}>
                <span aria-hidden={true}>×</span>
            </button>
            </div>

            <div className="modal-body">
            <div className="row">
                <div className="container">
                    <div className="form-row">
                        <Col md={12}>
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
                    </div>
                </div>
            </div>
            </div>

            <div className="modal-footer">
              {
                updateaction?
                <div className="ml-auto">
                    <Button className="btn-round" color="info" size="lg" onClick={() => updateBranchData() }>Save</Button>
                </div>:null
              }
              {
                addaction? 
                <div className="ml-auto">
                    <Button className="btn-round" color="info" size="lg" onClick={() => addBranchData() }>Submit</Button>
                </div>:null
              }
            </div>
      </Modal>
    </>
  );
}

export default BranchTable;
