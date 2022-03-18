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
  const [history, setHistory] = useState([])

  const [allodate,setAlloDate] = useState();
  const [disdate,setDisDate] = useState();
  

  const fetchDataBaseDate2 = async(value) => {
    setDisDate(value)
    const { data: {data} } = await axios.post("http://localhost:5000/ceciles/history/getcondition2",{
      allocation_date:allodate,
      distribution_date:value
    })
    setHistory(data);
  }

  const fetchDataBaseDate = async(value) => {
    setAlloDate(value)
    getHistory(value)
  }

  const columns = [
    {
        name: 'ID',
        selector: row => row.history_id,
        sortable: true,
        width:'8%'
    },
    {
        name: 'Branch',
        selector: row => row.branch,
        sortable: true,
    },
    {
      name: 'Product ID',
      selector: row => row.product_id,
      sortable: true,
      width:'15%'
    },
    {
      name: 'SA',
      selector: row => row.suggested_allocation_quantity,
      sortable: true,
      width:'8%'
    },
    {
      name: 'Distribution',
      selector: row => row.distribution_quantity,
      sortable: true,
    },
    {
      name: 'Percent',
      selector: row => row.percentage_quantity,
      sortable: true,
    },
    {
      name: 'Allocation Date',
      selector: row => row.allo_date,
      sortable: true,
    },
    {
      name: 'Distribution Date',
      selector: row => row.dis_date,
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

  async function getDate() {
    await axios.get("http://localhost:5000/ceciles/history/date").then((response) => {
      if(response.data.success == 1){
        const defaultValue = new Date(response.data.data[0].allo_date).toISOString().split('T')[0];
        setAlloDate(defaultValue)
        const default2Value = new Date(response.data.data[0].dis_date).toISOString().split('T')[0];
        setDisDate(default2Value)
        getHistory(defaultValue)
      }
      if(response.data.success == 0){
        const default2Value = new Date().toISOString().split('T')[0];
        setAlloDate(default2Value)
      }
    })
  }

  async function getHistory(value) {
    const { data: {data} } = await axios.post("http://localhost:5000/ceciles/history/getcondition",{
      allocation_date:value
    })
    setHistory(data);
  }

  useEffect(() => {
    getDate();

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
                    <h4>Distribution History</h4>
                    
                    <Collapse navbar>
                          <Form inline className="ml-auto">
                            <Col md={6}>
                              <span>Allocation Date</span>
                              <div className='custom-file'>
                                <Input id="allocation_date" defaultValue={allodate} type="date" onChange={(e) =>fetchDataBaseDate(e.target.value)} />
                              </div>
                            </Col>
                            <Col md={6}>
                              <span>Distribution Date</span>
                              <div className='custom-file'>
                                <Input id="allocation_date" defaultValue={disdate} type="date" onChange={(e) =>fetchDataBaseDate2(e.target.value)} />
                              </div>
                            </Col>
                          </Form>
                    </Collapse>
                </Navbar>
              </CardHeader>

              <CardBody>
                <DataTableExtensions columns={columns} data={history}>
                  <DataTable 
                    responsive
                    pagination 
                    columns={columns} 
                    data={history} 
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
