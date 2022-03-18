/*!

=========================================================
* Now UI Dashboard React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import StockAllocation from "views/StockAllocation.js";
import DistributeAllocation from "views/DistributeAllocation.js";
import BranchTable from "views/BranchTable.js";
import ProductTable from "views/ProductTable.js";
import History from "views/History";

// Settings
import Variation from "views/Variation.js";
import importcsv from "views/ImportCSV.js";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "business_chart-bar-32",
    component: Dashboard,
    layout: "/admin",
  },

  {
    path: "/stock-generated",
    name: "Stock Generated",
    icon: "files_paper",
    component: StockAllocation,
    layout: "/admin",
  },
  {
    path: "/distribution",
    name: "Distribution",
    icon: "files_paper",
    component: DistributeAllocation,
    layout: "/admin",
  },
  {
    path: "/history",
    name: "History",
    icon: "files_paper",
    component: History,
    layout: "/admin",
  },
  {
    path: "/branch-table",
    name: "Branch",
    icon: "files_single-copy-04",
    component: BranchTable,
    layout: "/admin",
  },
  {
    path: "/product-table",
    name: "Product",
    icon: "files_paper",
    component: ProductTable,
    layout: "/admin",
  },

  // Settings
  
  {
    path: "/variation",
    name: "Variation",
    icon: "files_single-copy-04",
    component: Variation,
    layout: "/admin",
  },

  {
    path: "/importcsv",
    name: "Import CSV",
    icon: "files_single-copy-04",
    component: importcsv,
    layout: "/admin",
  },
];

export default dashRoutes;
