import React, { Fragment, useState } from 'react';
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
        solddate: SRdate
      })
      .then(function (response) {
        console.log(response.data.data)
        if(response.data.success == 1){
          setTimeout(() => {
            setSalesMessage('Sales Report uploaded successfully');
          }, 1000);
        }
        if(response.data.success == 0){
          setTimeout(() => {
            setSalesMessage('Something went wrong while  Sales Report');
          }, 1000);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
      
      setFileReport('');
      setFileReportname('Choose File');
    } catch (err) {
      if (err) {
        setSalesMessage(err.message);
      } else {
        setSalesMessage(err.response.data.msg);
      }
    }
  };

  const executeProcess2 = async () => {
    await axios.post('http://localhost:5000/ceciles/allocations/importprocess2').
      then((res) => {
        if(res.data.success == 1 ){
          setStockMessage('Generating Allocation');
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
      }).then(async(response) => {
        if(response.data.success == 1){
          setStockMessage('Updating Inventories');
          await executeProcess2()
          await executeProcess3()
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
      if (err) {
        setStockMessage(err.message);
      } else {
        setStockMessage(err.response.data.msg);
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
                    <p className='text-dark text-center'>Import here the CSV file of Stock Status</p>
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
                    <p className='text-dark text-center'>Import here the CSV file of Sales Report</p>
                    <div className="container"> 
                      <div className="row">
                        <Col md={6}> 
                          <div className='custom-file'>
                            <Input id="allocation_date" type="date" onChange={(e) => setSRDate(e.target.value)} />
                          </div>
                        </Col>

                        <Col md={6}> 
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