// Sample data from Northwind database
// Based on https://github.com/graphql-compose/graphql-compose-examples/tree/master/examples/northwind/data/csv

export const sampleQueries = [
  {
    id: 1,
    name: "List All Customers",
    query: "SELECT * FROM Customers",
    description: "Display a list of all customers and their details"
  },
  {
    id: 2,
    name: "Top 10 Most Expensive Products",
    query: "SELECT ProductName, UnitPrice FROM Products ORDER BY UnitPrice DESC LIMIT 10",
    description: "Show the top 10 most expensive products"
  },
  {
    id: 3,
    name: "Orders by Customer",
    query: "SELECT c.CompanyName, COUNT(o.OrderID) as OrderCount \nFROM Customers c \nJOIN Orders o ON c.CustomerID = o.CustomerID \nGROUP BY c.CompanyName \nORDER BY OrderCount DESC",
    description: "Count of orders placed by each customer"
  },
  {
    id: 4,
    name: "Employee Sales Performance",
    query: "SELECT e.FirstName, e.LastName, COUNT(o.OrderID) as OrderCount, SUM(od.Quantity * od.UnitPrice) as TotalSales \nFROM Employees e \nJOIN Orders o ON e.EmployeeID = o.EmployeeID \nJOIN OrderDetails od ON o.OrderID = od.OrderID \nGROUP BY e.EmployeeID \nORDER BY TotalSales DESC",
    description: "Sales performance by employee"
  },
  {
    id: 5,
    name: "Product Sales by Category",
    query: "SELECT c.CategoryName, SUM(od.Quantity * od.UnitPrice) as TotalSales \nFROM Categories c \nJOIN Products p ON c.CategoryID = p.CategoryID \nJOIN OrderDetails od ON p.ProductID = od.ProductID \nGROUP BY c.CategoryName \nORDER BY TotalSales DESC",
    description: "Total sales amount by product category"
  }
];

export const queryResults = {
  1: {
    columns: ["CustomerID", "CompanyName", "ContactName", "ContactTitle", "City", "Country"],
    data: [
      ["ALFKI", "Alfreds Futterkiste", "Maria Anders", "Sales Representative", "Berlin", "Germany"],
      ["ANATR", "Ana Trujillo Emparedados y helados", "Ana Trujillo", "Owner", "México D.F.", "Mexico"],
      ["ANTON", "Antonio Moreno Taquería", "Antonio Moreno", "Owner", "México D.F.", "Mexico"],
      ["AROUT", "Around the Horn", "Thomas Hardy", "Sales Representative", "London", "UK"],
      ["BERGS", "Berglunds snabbköp", "Christina Berglund", "Order Administrator", "Luleå", "Sweden"],
      ["BLAUS", "Blauer See Delikatessen", "Hanna Moos", "Sales Representative", "Mannheim", "Germany"],
      ["BLONP", "Blondesddsl père et fils", "Frédérique Citeaux", "Marketing Manager", "Strasbourg", "France"],
      ["BOLID", "Bólido Comidas preparadas", "Martín Sommer", "Owner", "Madrid", "Spain"],
      ["BONAP", "Bon app'", "Laurence Lebihan", "Owner", "Marseille", "France"],
      ["BOTTM", "Bottom-Dollar Markets", "Elizabeth Lincoln", "Accounting Manager", "Tsawassen", "Canada"],
      ["BSBEV", "B's Beverages", "Victoria Ashworth", "Sales Representative", "London", "UK"],
      ["CACTU", "Cactus Comidas para llevar", "Patricio Simpson", "Sales Agent", "Buenos Aires", "Argentina"],
      ["CENTC", "Centro comercial Moctezuma", "Francisco Chang", "Marketing Manager", "México D.F.", "Mexico"],
      ["CHOPS", "Chop-suey Chinese", "Yang Wang", "Owner", "Bern", "Switzerland"],
      ["COMMI", "Comércio Mineiro", "Pedro Afonso", "Sales Associate", "São Paulo", "Brazil"]
    ]
  },
  2: {
    columns: ["ProductName", "UnitPrice"],
    data: [
      ["Côte de Blaye", "$263.50"],
      ["Thüringer Rostbratwurst", "$123.79"],
      ["Mishi Kobe Niku", "$97.00"],
      ["Sir Rodney's Marmalade", "$81.00"],
      ["Carnarvon Tigers", "$62.50"],
      ["Raclette Courdavault", "$55.00"],
      ["Manjimup Dried Apples", "$53.00"],
      ["Tarte au sucre", "$49.30"],
      ["Ipoh Coffee", "$46.00"],
      ["Rössle Sauerkraut", "$45.60"]
    ]
  },
  3: {
    columns: ["CompanyName", "OrderCount"],
    data: [
      ["Ernst Handel", "10"],
      ["QUICK-Stop", "7"],
      ["Save-a-lot Markets", "6"],
      ["Folk och fä HB", "5"],
      ["Bon app'", "4"],
      ["Berglunds snabbköp", "4"],
      ["Suprêmes délices", "4"],
      ["White Clover Markets", "4"],
      ["Hanari Carnes", "3"],
      ["Königlich Essen", "3"],
      ["Ottilies Käseladen", "3"],
      ["Richter Supermarkt", "3"],
      ["Seven Seas Imports", "3"],
      ["Bottom-Dollar Markets", "3"],
      ["Die Wandernde Kuh", "3"]
    ]
  },
  4: {
    columns: ["FirstName", "LastName", "OrderCount", "TotalSales"],
    data: [
      ["Margaret", "Peacock", "40", "$250,187.45"],
      ["Janet", "Leverling", "31", "$213,051.30"],
      ["Andrew", "Fuller", "20", "$177,913.95"],
      ["Nancy", "Davolio", "27", "$157,936.10"],
      ["Robert", "King", "14", "$141,295.99"],
      ["Laura", "Callahan", "10", "$133,301.03"],
      ["Michael", "Suyama", "15", "$103,719.25"],
      ["Anne", "Dodsworth", "9", "$82,964.00"],
      ["Steven", "Buchanan", "13", "$75,567.75"]
    ]
  },
  5: {
    columns: ["CategoryName", "TotalSales"],
    data: [
      ["Beverages", "$267,868.79"],
      ["Dairy Products", "$234,516.97"],
      ["Confections", "$167,378.55"],
      ["Seafood", "$141,623.41"],
      ["Meat/Poultry", "$114,837.99"],
      ["Produce", "$105,268.51"],
      ["Condiments", "$88,323.11"],
      ["Grains/Cereals", "$68,178.45"]
    ]
  }
}; 