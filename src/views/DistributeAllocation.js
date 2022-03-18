import React, { useCallback, useDebugValue, useEffect, useMemo, useState } from "react"
import { useDropzone } from "react-dropzone"
import DataTable from "react-data-table-component"
import DataTableExtensions from 'react-data-table-component-extensions';
import "react-data-table-component-extensions/dist/index.css";  
import axios from "axios";
import Select from 'react-select';

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
        Modal}
from "reactstrap"
import { createPortal } from "react-dom";

function DistributeAllocation(props) {
  //Fetch allocation base on allocation date
  const [date, setDate] = useState("2022-02-27")
  const [listdate,setListDate] = useState({})
  
  const [allodate,setAlloDate] = useState();

  const [SRdate, setSRDate] = useState("");
  
  const [branches, setBranches] = useState([])
  
  const [branchname, setBranchName] = useState('')
  
  const [item, setItem] = useState([])

  //Modal
  const [modalView, setModalView] = useState(false)

  //Loading animaition
  const [pending, setPending] = useState(true)
  
  const [generatedislabel, setGenerateLabel] = useState('Generating Distribution...')
  const [generatedisfeedback,setGenerateDistributionFeedback] = useState(false)

  

  function getItem(){
    return axios.post("http://localhost:5000/ceciles/distributions/",{
         allocation_date:SRdate
     })
  }

  const getItem2 = (branch) => {  
    if(SRdate != '' && SRdate != null){
      console.log('called ' + SRdate )
      return axios.post("http://localhost:5000/ceciles/distributions/bydate",{
           branchname:branch,
           allocation_date:SRdate
       })
    }
    return axios.post("http://localhost:5000/ceciles/distributions/bybranches",{
         branch
     })
   }
   
   const viewBranch = async (branch) => {
     setBranchName(branch)
     const allocation_items = getItem2(branch)
     setItem((await allocation_items).data.data)
     setModalView(true)
   }
  
  const generateDistribution = async () => {
    setGenerateDistributionFeedback(true)
    await axios.put("http://localhost:5000/ceciles/distributions/generatedistribution")
      .then((response) =>{
        if(response.data.success == 1){
            console.log(response.data.message);
            console.log(response.data);
            setGenerateLabel(response.data.message);
        } else {
            console.log("response.data.message");
        }
    });
	}

  const saveDistribution = async() => {
    await axios.post("http://localhost:5000/ceciles/distributions/save")
      .then((response) =>{
        if(response.data.success == 1){
          console.log(response.data)
        } else {
            console.log(response.data);
        }
    });
  }
  
  const defaultGenerateDistribution = () => {
    setGenerateDistributionFeedback(false)
    setGenerateLabel('Generating Distribution...')
  }


  async function getDate() {
    await axios.get("http://localhost:5000/ceciles/distributions/listdates").then((response) => {
      console.log(response.data.data[0].allo_date)
      if(response.data.success == 1){
        const defaultValue = new Date(response.data.data[0].allo_date).toISOString().split('T')[0];
        setAlloDate(defaultValue)
      }
      if(response.data.success == 0){
        const default2Value = new Date().toISOString().split('T')[0];
        setAlloDate(default2Value)
      }
    })
  }

  useEffect(() => {
    getDate();
    async function getBranches() {
      const { data: {data} } = await axios.get("http://localhost:5000/ceciles/models/listbranches")
      setBranches(data)
    }
    getBranches()

    const timeout = setTimeout(() => {
			setPending(false);
		}, 2000);
		return () => clearTimeout(timeout);

  },[])

  const fetchDataBaseDate = async(value) => {
    setSRDate(value);
    const allocation_items = getItem2(branch)
    setItem((await allocation_items).data.data)
  }

  
  const columns = [
    {
        name: 'ID',
        cell: (row, index) => ++index,
        sortable: true,
        width: '5%',
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
        cell: (row, index) => row.distribution_id,
        sortable: true,
        width: '10%',
    },
    {
        name: 'PID',
        cell: row => row.product_id,
        sortable: true,
    },
    {
      name: 'PName',
      cell: row => row.product_name,
      sortable: true,
    },
    {
      name: 'SA Qty',
      cell: row => row.suggested_allocation_quantity,
      sortable: true,
    },
    {
      name: 'Distribution Qty',
      cell: row => row.distribution_quantity,
      sortable: true,
    },
    {
      name: 'Percentage',
      cell: row => row.percentage_quantity,
      sortable: true,
    },
    {
      cell: row => <Button color="success" type="button" className="btn-round">Edit</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  
    {
      name: '',
      cell: row => <Button color="danger" type="button" className="btn-round" onClick={() => rowDelete(row.branch,row.product_id,row.product_name,row.allocation_date) }>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]


  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
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
                          <Form inline className="auto">
                                <span>Allocation Date</span>
                            <Col md={6}> 
                              <div className='custom-file'>
                                <Input id="allocation_date" defaultValue={allodate} type="date" onChange={(e) =>fetchDataBaseDate(e.target.value)} />
                              </div>
                            </Col>
                          </Form>
                          <Form inline className="ml-auto">
                            <Button color="warning" type="button" className="btn-round" size="ml" onClick={() => generateDistribution()}> 
                                Distribute
                            </Button>
                            <Button color='success' type="button" className="btn-round" size="ml" onClick={() => saveDistribution()}> 
                                Save Distribution
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
      </div>
      
      {/* MODAL  VIEW*/}
      <Modal isOpen={modalView} className="modal-xl" modalClassName="bd-example-modal-lg" toggle={() => setModalView(false)}>
        <div className="modal-header">
          <h4 className="modal-title" id="myLargeModalLabel">
            {branchname} Distribution
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

      <Modal isOpen={generatedisfeedback} className="modal-md" modalClassName="bd-example-modal-lg" >
          <div className="modal-header    ">
          <h4 className="modal-title" id="myLargeModalLabel">
              Generating Distribution
          </h4>
          </div>

          <div className="modal-body">
          <div className="row">
              <div className="container">
                  <div className="form-row">
                      <Col md={12}>
                          <FormGroup className="col-md-12">
                              <label htmlFor="label"><h4>{generatedislabel}</h4></label>
                          </FormGroup>
                      </Col>
                  </div>
              </div>
          </div>
          </div>

          <div className="modal-footer">
              <div className="ml-auto">
                  <Button className="btn-round" color="info" size="lg" onClick={() => defaultGenerateDistribution() }>Close</Button>
              </div>
          </div>
      </Modal>
    </>
  );
}

export default DistributeAllocation;