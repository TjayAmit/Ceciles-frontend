import React, { Fragment, useState , Component} from 'react';
import Select from 'react-select'
import Message from './Message';
import axios from 'axios';

import {
  Card,
  Row,
  Col,
  Input,
  CardHeader,
  CardTitle,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  CardBody,
  CardFooter,
} from "reactstrap";

const ImportCSV = () => {

  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [fileReport, setFileReport] = useState('');
  const [fileReportname, setFileReportname] = useState('Choose File');
  const [messagestock, setStockMessage] = useState('');
  const [messagesales, setSalesMessage] = useState('');
  const [SRdate, setSRDate] = useState("");
  
  const [saveimportlabel, setSaveImportLabel] = useState('Importing Data...')
  const [saveimportfeedback,setSaveImportFeedback] = useState(false)

  const [checkvalue,setCheckValue] = useState(true);
  const [optionvalue,setOptionValue] = useState(0);
  const [inventorygoalvalue,setInventoryGoal] = useState(0);


  
  const options = [
    { index:0, value: 30, label: '1 Month(30 days)'},
    { index:2,value: 60, label: '2 Months(60 days)' },
    { index:4,value: 90, label: '3 Months(90 days)'},
  ]

  const inventory_goal = [
    { index:0, value: 30, label: '30 days'},
    { index:1,value: 45, label: '45 days'},
    { index:2,value: 60, label: '60 days' },
    { index:3,value: 75, label: '75 days'},
    { index:4,value: 90, label: '90 days'},
  ]

  const saveImportData = async () => {
    setTimeout(() => {
      setSaveAlloLabel('Imported successfully')
		}, 1000);
  }

  const defaultImportData = () => {
    setSaveAlloFeedback(false)
    setSaveAlloLabel('Importing Data...')
  }

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onChangeReport = e => {
    setFileReport(e.target.files[0]);
    setFileReportname(e.target.files[0].name);
  };

  const updateOptionValue = (option) => {
    setOptionValue(option.value);
  }

  const updateInventoryGoal = (goal) => {
    setInventoryGoal(goal.value);
  }

  const onSubmitReport = async e => {
    //Sales Report
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', fileReport);

    try {
      const resUpload = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      const { filename } = resUpload.data;
      setSalesMessage(`Importing ${filename}`)

      await axios.post('http://localhost:5000/ceciles/allocations/importsales', {
        filename: filename,
        months:optionvalue,
      })
      .then( (response) => {
        if(response.data.success == -1){
          setTimeout(() => {
            setSalesMessage(response.data.message);
          }, 1000);
        }if(response.data.success == 1){
          setTimeout(() => {
            setSalesMessage('Sales Report successfully');
          }, 1000);
        }
        if(response.data.success == 0){
          setTimeout(() => {
            setSalesMessage(response.data.message);
          }, 1000);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
      
      setFileReport('');
      setFileReportname('Choose File');
    } catch (err) {
      if(err.message == "Network Error"){
        setSalesMessage("It seems the server is offline");
      }
    }
  };

  const executeProcess2 = async () => {
    await axios.post('http://localhost:5000/ceciles/allocations/importprocess2',{
      date:optionvalue
    }).
      then((res) => {
        if(res.data.success == 1 ){
          if(checkvalue == true){
            setStockMessage('Generating Allocation');
          }else{
            setStockMessage('Inventories Successfully updated');}
        }
      }).catch((error)=>{
        console.log(error)
      })
  }

  const executeProcess3 = async () => {
    axios.post('http://localhost:5000/ceciles/allocations/importprocess3').
      then((res) => {
        if(res.data.success == 1 ){
          setStockMessage(`Successfully Generated Allocation`);
        }
      }).catch((error)=>{
        console.log(error)
      })
  }

  const onSubmitStatus = async e => {
    //Stock Status
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const resUpload = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
  
      const { filename} = resUpload.data;
      setStockMessage(`Importing ${filename}`)
      setTimeout(() => {
        setStockMessage('Processing Stock Status Data');
      }, 2000);

      const process1 = await axios.post('http://localhost:5000/ceciles/allocations/importstock', {
        filename: filename,
        months:inventorygoalvalue,
        isupdate_inventory:checkvalue,
      }).then(async(response) => {
        if(response.data.success == 1){
          setStockMessage('Updating Inventories');
          await executeProcess2()   
          if(checkvalue == true){
            await executeProcess3()
          }
        }
        if(response.data.success == 0){
          setTimeout(() => {
            setStockMessage('Something went wrong while import Stock Status');
          }, 1000);
        }
        if(response.data.success == -1){
          console.log(response.data.message.sqlState);
          if(response.data.message.sqlState == 42000){
            setTimeout(() => {
              setStockMessage(`Error Format in ${filename}`);
            }, 1000);
          }else{
            setTimeout(() => {
              setStockMessage('Something went wrong');
            }, 1000);
          }
        }
      })
      .catch((error) =>{
        console.log(error); 
      });

      setFileReport('');
      setFileReportname('Choose File');
    } catch (err) {
      if(err.message == "Network Error"){
        setStockMessage("It seems the server is offline");
      }
    }
  };

  return (
      <>
      <div className="page-header clear-filter" filter-color="blue"></div>
        <div className="container"></div>
          <div className="content">
        <Row>
          <Col xs={12} md={6}>
            <Card className="card-chart">
              <CardHeader>
              {messagestock ? <Message msg={messagestock} /> : null}
              <h5 className="card-category text-center"></h5>
                <CardTitle  className='text-center' tag="h4">Stock Status</CardTitle>
              </CardHeader>

              <CardBody>
                <div className="chart-area">
                  <form onSubmit={onSubmitStatus}>
                    <p className='text-dark text-center'>Import Stock Status CSV file </p>
                    <div className="container">
                      <Col md={12}>
                        <div className='custom-file mb-4'>
                          <input
                            type='file' 
                            className='custom-file-input'
                            id='customFile'
                            onChange={onChange}
                          />
                          <label className='custom-file-label' htmlFor='customFile'>
                            {filename}
                          </label>
                        </div>
                        <Row xs={2}>
                          <Col md={5}>
                            <Input type="checkbox" checked={checkvalue} onChange={(e) => setCheckValue(e.target.checked)} />
                            <label htmlFor="label">Generate Suggested Order</label> 
                          </Col>
                          <Col md = {7}>
                            <Select  placeholder="Monthly Goal" onChange={(value) => {updateInventoryGoal(value)}}  options={inventory_goal}/>
                          </Col>
                        </Row>
                        <input
                        type='submit'
                        value='Upload'
                        className='btn btn-primary btn-block mt-4'
                        />
                      </Col>
                    </div>
                  </form>
                </div>
              </CardBody>
              <CardFooter>
                <div className="stats text-center">
                </div>
              </CardFooter>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="card-chart">
              <CardHeader>
              {messagesales ?<Message msg={messagesales} />:null}
              <div className="text-center"></div>
                <CardTitle className='text-center' tag="h4">Sales Report</CardTitle>
              </CardHeader>

              <CardBody>
                <div className="chart-area">
                  <form onSubmit={onSubmitReport}>
                    <p className='text-dark text-center'>Import Sales Report CSV file </p>
                    <div className="container"> 
                      <div className="row">
                        <Col md={12}>
                          <div className='custom-file mb-4'>
                            <input
                                type='file'
                                className='custom-file-input'
                                id='customFile'
                                onChange={onChangeReport}
                              />
                            
                            <label className='custom-file-label' htmlFor='customFile'>
                              {fileReportname}
                            </label>
                          </div>
                              <Row xs={2}>
                                <Col md = {12}>
                                  <Select  placeholder="Sales Report Number of Months" onChange={(value) => {updateOptionValue(value)}}  options={options}/>
                                </Col>
                              </Row>
                        </Col>
                        <Col>
                          <div className="text-center">
                            <input
                              type='submit'
                              value='Upload'
                              className='btn btn-primary btn-block mt-4'
                            />
                          </div>
                        </Col>
                      </div>
                    </div>
                  </form>
                </div>
              </CardBody>

              <CardFooter>
                <div className="stats text-center">
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
    </div>
    </>
  );
};

export default ImportCSV;