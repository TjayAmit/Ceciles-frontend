/*! */
import React, { useEffect, useState } from "react"
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import DataTable from "react-data-table-component"
import axios from "axios";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  Button,
  Label,
  FormGroup,
  Input,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";

import {
  dashboardShippedProductsChart,
  dashboardAllProductsChart,
  dashboard24HoursPerformanceChart,
} from "variables/charts.js";

function Dashboard() {
  // Chart
  // Sold Quantity per Branch
  const [qty, setQuantity] = useState("")
  // Sale Per Month
  const [prod, setProducts] = useState("")
  // Overall sold quantity in every month
  const [prodQty, setProductsQty] = useState("")

  // Table 
  // Most Saleable Prod
  const [product, setProduct] = useState([])
  // Average per day sold per branch
  const [productPerDay, setProductPerDay] = useState([])

  // TABLE DATA
  const columns = [
    {
        name: 'Product ID',
        selector: row => row.product_id,
        sortable: true,
    },

    {
        name: 'Product Name',
        selector: row => row.product_name,
        sortable: true,
    },

    {
      name: 'Sold Quantity',
      selector: row => row.sold_quantity,
      sortable: true,
    },
  ]

  const columnsPerDay = [
    {
        name: 'Product Name',
        selector: row => row.product_name,
        sortable: true,
    },

    {
        name: 'Branch',
        selector: row => row.branch,
        sortable: true,
    },

    {
      name: 'Sold Quantity',
      selector: row => row.average_quantity_sold,
      sortable: true,
    },
  ]

  // CHARTDATA
  const chartOne= () => {
    let brn = []
    let qty = []
    let itm = []

    axios.get('http://localhost:5000/ceciles/models/c')
    .then(res => {
      console.log(res)
      for (const dataObj of res.data.data) {
        brn.push(dataObj.branch);
        qty.push(parseInt(dataObj.sold_quantity));
      }
      setQuantity({
        labels: brn,
        datasets: [
          {
            label: "Quantity",
            borderColor: "#f96332",
            pointBorderColor: "#FFF",
            pointBackgroundColor: "#f96332",
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 4,
            fill: true,
            backgroundColor: ['rgba(249, 99, 59, 0.40)'],
            borderWidth: 2,
            tension: 0.4,
            data: qty,
          },
        ],
      })
    })
    .catch(err => {
      console.log(err)
    })
    console.log(brn,qty);
  }

  const chartTwo = () => {
    let itm = []
    let qty = []

    axios.get('http://localhost:5000/ceciles/models/b')
    .then(res => {
      console.log(res)
       for (const dataObj of res.data.data) {
        itm.push(dataObj.product_name);
        qty.push(parseInt(dataObj.quantity));
        }
      setProducts({
        labels: itm,
        datasets: [
          {
            label: "Quantity",
            label: "Unilab",
          backgroundColor: "0, 170, 0, 50",
          borderColor: "#2CA8FF",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#2CA8FF",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          borderWidth: 1,
            data: qty,
          },
        ],
        
      })
    })
    .catch(err => {
      console.log(err)
    })
    console.log(itm,qty);
  }

  const chartThree = () => {
    let itm = []
    let qty = []

    axios.get('http://localhost:5000/ceciles/models/a')
    .then(res => {
      console.log(res)
       for (const dataObj of res.data.data) {
        itm.push(dataObj.product_name);
        qty.push(parseInt(dataObj.quantity));
        }
        setProductsQty({
        labels: itm,
        datasets: [
          {
            label: "Quantity", 
            borderColor: "#18ce0f",
            pointBorderColor: "#FFF",
            pointBackgroundColor: "#18ce0f",
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 4,
            fill: true,
            backgroundColor: "#CCFFCC",
            borderWidth: 2,
            tension: 0.4,
            data: qty,
          },
        ],
        
      })
    })
    .catch(err => {
      console.log(err)
    })
    console.log(itm,qty);
  }

  useEffect(() => {
    chartOne()
    chartTwo()
    chartThree()
    
    async function getSaleableProducts() {
      const { data: {data} } = await axios.get("http://localhost:5000/ceciles/models/d")

      setProduct(data);
      console.log(data);
    }

    async function getProductPerDay() {
      const { data: {data} } = await axios.get("http://localhost:5000/ceciles/models/f")

      setProductPerDay(data);
      console.log(data);
    }


    getSaleableProducts();
    getProductPerDay();
  },[])

  return (
    <>
     <div className="page-header clear-filter" filter-color="blue">
        <div className="container"></div>
          <div className="content">
            <Row>
              {/* Card 1 */}
              <Col xs={12} md={4}>
                <Card className="card-chart">
                  <CardHeader>
                    <h5 className="card-category">Sold Product Per Branch</h5>
                    <CardTitle tag="h4">Sold Quantity Per Branch</CardTitle>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        className="btn-round btn-outline-default btn-icon"
                        color="default"
                      >
                      
                        <i className="now-ui-icons loader_gear" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>Branch</DropdownItem>
                        <DropdownItem>Date</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-area">
                      <Line
                        data={ qty }
                        options={ dashboardShippedProductsChart.options }
                      />
                    </div>
                  </CardBody>
                  <CardFooter>
                    <div className="stats">
                      <i className="now-ui-icons arrows-1_refresh-69" /> 
                        Latest Chart
                    </div>
                  </CardFooter>
                </Card>
              </Col>

              {/* Card 2 */}
              <Col xs={12} md={4}>
                <Card className="card-chart">
                  <CardHeader>
                    <h5 className="card-category">Sold Item</h5>
                    <CardTitle tag="h4">Sold Item Per Month</CardTitle>
                  </CardHeader>

                  <CardBody>
                    <div className="chart-area">
                      <Bar
                        data={prod}
                        options={dashboard24HoursPerformanceChart.options}
                      />
                    </div>
                  </CardBody>

                  <CardFooter>
                    <div className="stats">
                      <i className="now-ui-icons arrows-1_refresh-69" /> 
                        Latest Chart
                    </div>
                  </CardFooter>
                </Card>
              </Col>

              {/* Card 3 */}
              <Col xs={12} md={4}>
                <Card className="card-chart">
                  <CardHeader>
                    <h5 className="card-category">Overall Saleable Product</h5>
                    <CardTitle tag="h4">All products</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className="chart-area">
                      <Line
                        data={prodQty}
                        options={dashboardAllProductsChart.options}
                      />
                    </div>
                  </CardBody>
                  <CardFooter>
                    <div className="stats">
                      <i className="now-ui-icons arrows-1_refresh-69" /> 
                        Latest Chart
                    </div>
                  </CardFooter>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <Card>
                  <CardHeader>
                    <h5 className="card-category">Most Saleable Product</h5>
                  </CardHeader>
                  <CardBody>
                    <DataTable 
                        responsive                        
                        columns={columns} 
                        data={product} 
                      />
                  </CardBody>
                </Card>
              </Col>

              <Col xs={12} md={6}>
                <Card>
                  <CardHeader>
                    <h5 className="card-category">Average Sold Per Day</h5>
                  </CardHeader>
                  <CardBody>
                  <DataTable 
                        responsive                        
                        columns={columnsPerDay} 
                        data={productPerDay} 
                      />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
      </div>
    </>
  );
}

export default Dashboard;


