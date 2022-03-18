// ##############################
// // // tasks list for Tasks card in Dashboard view
// #############################

const tasks = [
  {
    checked: true,
    text: 'Sign contract for "What are conference organizers afraid of?"',
  },
  {
    checked: false,
    text: "Lines From Great Russian Literature? Or E-mails From My Boss?",
  },
  {
    checked: true,
    text:
      "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
  },
];

// ##############################
// // // table head data and table body data for Tables view
// #############################

const thead = ["Manufacturer", "Branch", "Item Description", "Date", "Quantity"];
const tbody = [
  {
    className: "table-success",
    data: ["Unilab", "ALANO", "Enervon HR", "March 01, 2021", "38"],
  },
  {
    className: "",
    data: ["Unilab", "ALANO", "Alaxan FR","March 01, 2021", "9"],
  },
  {
    className: "table-info",
    data: ["Unilab", "ALANO", "Amlife", "March 01, 2021", "2"],
  },
  {
    className: "",
    data: ["Unilab", "ALANO", "Biogesic", "March 01, 2021", "5"],
  },
  {
    className: "table-danger",
    data: ["Unilab", "ALANO", "Ceelin", "March 01, 2021", "2"],
  },
  { className: "", data: ["Unilab", "ALANO", "Candez", "March 01, 2021", "15"] },
  {
    className: "table-warning",
    data: ["Unilab", "ALANO", "Zenith", "March 01, 2021", "615"],
  },
];

// tasks list for Tasks card in Dashboard view
// data for <thead> of table in TableList view
// data for <tbody> of table in TableList view
export { tasks, thead, tbody };
