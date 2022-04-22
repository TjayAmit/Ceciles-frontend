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
        Modal,
        Spinner,
        Label,
        NavbarBrand}
from "reactstrap"
import { createPortal } from "react-dom";

function DistributeAllocation(props) {
  //Fetch allocation base on allocation date
  
  const [allodate,setAlloDate] = useState();
  const [SRdate, setSRDate] = useState("");
  
  const [branches, setBranches] = useState([])
  
  const [branchname, setBranchName] = useState('')
  
  const [item, setItem] = useState([])

  const [option, setOption] = useState([])

  //Modal
  const [modalView, setModalView] = useState(false)

  //Loading animaition
  const [pending, setPending] = useState(true)
  
  const [saveFeedBackDistribution,setFeedBackDistribution] = useState(false)
  const [saveFeedLabel,setFeedLabel] = useState("Saving Distribution")
  const [saveSpinner,setSpinner] = useState(true)

  const [generatedislabel, setGenerateLabel] = useState('Generating Distribution')
  const [generatedisfeedback,setGenerateDistributionFeedback] = useState(false)
  const [showSpin,setShowSpin] = useState(true)

  const [dateoption,setDateOption] = useState('');
  const [manufactureroption,setManufacturerOption] = useState('');

  

  function getItem(){
    return axios.post("http://localhost:5000/ceciles/distributions/",{
         allocation_date:SRdate
     })
  }

  const getItem2 = (branch) => {  
    if(dateoption != '' && dateoption != null){
      return axios.post("http://localhost:5000/ceciles/distributions/bydate",{
           branchname:branch,
           allocation_date:dateoption,
           manufacturer:manufactureroption  
       })
    }
    return axios.post("http://localhost:5000/ceciles/distributions/bybranches",{
         branch,
         allocation_date:dateoption,
         manufacturer:manufactureroption
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
    await axios.put("http://localhost:5000/ceciles/distributions/generatedistribution",{
      allocation_date:dateoption,
      manufacturer:manufactureroption,
    })
      .then((response) =>{
        if(response.data.success == 1){
            setShowSpin(false)
            setGenerateLabel("Generating Distribution Success");
        }
        if(response.data.success == 0){
          setShowSpin(false)
          setGenerateLabel('Problem occure while saving allocation')
        }
        if(response.data.success == -1){
          setShowSpin(false)
          setGenerateLabel('Problem occure while saving allocation')
        }
    });
	}

  const saveDistribution = async() => {
    setFeedBackDistribution(true)
    await axios.post("http://localhost:5000/ceciles/distributions/save",{
      allocation_date:dateoption,
      manufacturer:manufactureroption
    })
      .then((response) =>{
        if(response.data.success == 1){
            setSpinner(false)
            setFeedLabel("Distribution Saved");
        }
        if(response.data.success == 0){
          setSpinner(false)
          setFeedLabel('Problem occure while saving distribution')
        }
        if(response.data.success == -1){
          setSpinner(false)
          setFeedLabel('Problem occure while saving distribution')
        }
    });
  }
  
  const rowDelete = (dis) => {
    axios.delete(`http://localhost:5000/ceciles/distributions/delete/${dis}`).then(async(response) => {
      console.log(response)
      if(response.data.success == 1){
        await getItem2(branchname)
        .then((response) => {
          setItem(response.data.data)
        })
      }
      if(response.data.success == -1){
        console.log(response.data.message)
      }
    });
  }
  const defaultGenerateDistribution = () => {
    setGenerateDistributionFeedback(false)
    setShowSpin(true)
    setGenerateLabel('Generating Distribution')
  }
  
  const defaultSaveDistribution = () => {
    setFeedBackDistribution(false)
    setSpinner(true)
    setFeedLabel('Saving Distribution')
  }

  async function getDateSelect() {
    await axios.get("http://localhost:5000/ceciles/distributions/byselect").then((response) => {
      if(response.data.success == 1){
        setOption(response.data.data);
        const list = response.data.data[0]["label"].split(' ');
        setDateOption(list[0]);
        setManufacturerOption(list[1]);
      }
      if(response.data.success == 0){
        console.log(response.data.message)
      }
    })
  }

  useEffect(() => {
    getDateSelect();
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

  const updateManufacturer = (value) => {
    const list = value.label.split(' ');
    setDateOption(list[0]);
    setManufacturerOption(list[1]);
  }
  
  const columns = [
    {
        name: 'ID',
        cell: (row, index) => ++index,
        selector: (row, index) => ++index,
        sortable: true,
        width: '5%',
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
        cell: (row, index) => row.distribution_id,
        selector: (row, index) => row.distribution_id,
        sortable: true,
        width: '10%',
    },
    {
        name: 'PID',
        cell: row => row.product_id,
        selector: row => row.product_id,
        sortable: true,
    },
    {
      name: 'PName',
      cell: row => row.product_name,
      selector: row => row.product_name,
      sortable: true,
    },
    {
      name: 'SO Qty',
      cell: row => row.suggested_allocation_quantity,
      selector: row => row.suggested_allocation_quantity,
      sortable: true,
    },
    {
      name: 'Distribution Qty',
      cell: row => row.distribution_quantity,
      selector: row => row.distribution_quantity,
      sortable: true,
    },
    {
      name: 'Percentage',
      cell: row => parseInt(row.percentage_quantity * 100) + '%',
      selector: row => row.percentage_quantity,
      sortable: true,
    },
    {
      name: '',
      cell: row => <Button color="danger" type="button" className="btn-round" onClick={() => rowDelete(row) }>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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
                          <Form inline className="auto" >
                            <Col md = {12}>
                              <Select  placeholder="Select PO" onChange={(value) => {updateManufacturer(value)}}  options={option}/>
                            </Col>
                          </Form>
                          <Form inline className="ml-auto">
                            <Button color="info" type="button" className="btn-round" size="ml" onClick={() => generateDistribution()}> 
                                Generate Distribute
                            </Button>
                            <Button color='secondary' type="button" className="btn-round" size="ml" onClick={() => saveDistribution()}> 
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
      
      {/* MODAL  VIEW*/}
      <Modal isOpen={modalView} className="modal-xl" modalClassName="bd-example-modal-lg">
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

      <Modal isOpen={generatedisfeedback} className="modal-md" modalClassName="bd-example-modal-lg" centered>
          <div className="modal-header    ">
          </div>
          <div className="modal-body">
          <div className="row">
              <div className="container">
                  <div className="form-row">
                      <Col md={12}>
                          <FormGroup className="col-md-12">
                          {showSpin?<Spinner />:null}<label className="py-3 px-md-3" htmlFor="label"><h4>{generatedislabel}</h4></label>
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
      

      <Modal isOpen={saveFeedBackDistribution} className="modal-md" modalClassName="bd-example-modal-lg" centered>
          <div className="modal-header    ">
          </div>

          <div className="modal-body">
          <div className="row">
              <div className="container">
                  <div className="form-row">
                      <Col md={12}>
                          <FormGroup className="col-md-12">
                          {saveSpinner?<Spinner />:null}<label className="py-3 px-md-3" htmlFor="label"><h4>{saveFeedLabel}</h4></label>
                          </FormGroup>
                      </Col>
                  </div>
              </div>
          </div>
          </div>

          <div className="modal-footer">
              <div className="ml-auto">
                  <Button className="btn-round" color="info" size="lg" onClick={() => defaultSaveDistribution() }>Close</Button>
              </div>
          </div>
      </Modal>
    </>
  );
}

export default DistributeAllocation;
