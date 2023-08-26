// Add an event listener for form submission - add new product 
document.getElementById("addProductForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    // Get values from form fields
    const name = document.getElementById("name").value;
    const image = document.getElementById("image").value;
    const brand = document.getElementById("brand").value;
    const category = document.getElementById("category").value;
    const price = parseFloat(document.getElementById("price").value);
    const countInStock = parseInt(document.getElementById("countInStock").value);
    const rating = parseFloat(document.getElementById("rating").value);
    const numReviews = parseInt(document.getElementById("numReviews").value);
    const description = document.getElementById("description").value;
    const color = document.getElementById("color").value;
    const popularity = document.getElementById("popularity").value;
  
    const productData = {
      name,
      image,
      brand,
      category,
      price,
      countInStock,
      rating,
      numReviews,
      description,
      color,
      popularity
    };
  
    // Call the addProduct function with the extracted data
   await addProduct(productData, event);
  
  });
  
  // add a new product to mongoDB
  async function addProduct(productData, event) {
    console.log("inside addProduct");
    try {
        const response = await fetch(`/api/store-products/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      const data = await response.json();
      console.log("log:", data)
      if (data.message === 'Product added successfully') {
        console.log("Product added successfully!");
        // Reset the form after successful product addition
        event.target.reset();
        } else {
        console.error("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }
  
  //Registered users 
    // Fetch user data from MongoDB using an API endpoint
    async function fetchUserData() {
      const response = await fetch('/api/store-user'); // Replace with your API endpoint
      const data = await response.json();
      return data;
  }
  
  // Function to render the user table
  function renderUserTable(data) {
      const tableContainer = d3.select('#userTable');
      const table = tableContainer.append('table').attr('class', 'table');
      
      // Table header
      const thead = table.append('thead').append('tr');
      thead.append('th').text('ID');
      thead.append('th').text('Username');
      thead.append('th').text('Email');
      thead.append('th').text('Actions');
  
      // Table body
      const tbody = table.append('tbody');
      data.forEach(user => {
          const row = tbody.append('tr');
          row.append('td').text(user._id); // Assuming the user document has _id field
          row.append('td').text(user.name);
          row.append('td').text(user.email);
          const actionsCell = row.append('td');
          const deleteButton = actionsCell.append('button').attr('class', 'btn btn-danger').text('Delete');
          deleteButton.on('click', () => deleteUser(user._id)); // Call a function to delete the user
      });
  }
  
  
  // Function to delete a user
  async function deleteUser(userId) {
  const response = await fetch(`/api/store-user`, {
  method: 'DELETE',
  headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({ _id: userId })
  });
  
  const data = await response.json();
  if (data.success) {
  // Reload the user table after successful deletion
  const userData = await fetchUserData();
  d3.select('#userTable').selectAll('*').remove(); // Clear existing table
  renderUserTable(userData);
  } else {
  console.error('Failed to delete user.');
  }
  }
  
  // Entry point: Fetch user data and render the user table
  async function init() {
      const userData = await fetchUserData();
      renderUserTable(userData);
  }
  
  init(); // Initialize the script when the page loads
  
  //D3
  // Load data from the server (Product availability data)
  d3.json("http://localhost:3330/api/store-products", function (error, data) {
    if (error) throw error;
  
    const products = data.map(item => ({ name: item.name, countInStock: item.countInStock }));
  
    // Create scales for X and Y values for the Scatter Plot
    const scatterPlotWidth = 1300;
    const scatterPlotHeight = 1000;
  
    const xScaleScatterPlot = d3.scaleLinear()
        .domain([0, d3.max(products, product => product.countInStock)])
        .range([0, scatterPlotWidth]);
  
    const yScaleScatterPlot = d3.scaleLinear()
        .domain([0, d3.max(products, product => product.countInStock)])
        .range([scatterPlotHeight, 0]);
  
    // Create SVG for the Scatter Plot
    const svgScatterPlot = d3.select("#scatter-plot")
        .attr("width", scatterPlotWidth)
        .attr("height", scatterPlotHeight);
  
    const chartGroupScatterPlot = svgScatterPlot.append("g")
        .attr("transform", `translate(40, 20)`);
  
    // Create X and Y axes for the Scatter Plot
    const xAxisScatterPlot = d3.axisBottom(xScaleScatterPlot);
    const yAxisScatterPlot = d3.axisLeft(yScaleScatterPlot);
  
    chartGroupScatterPlot.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${scatterPlotHeight})`)
        .call(xAxisScatterPlot);
  
    chartGroupScatterPlot.append("g")
        .attr("class", "y-axis")
        .call(yAxisScatterPlot);
  
    // Create circles for the Scatter Plot
    chartGroupScatterPlot.selectAll(".circle")
        .data(products)
        .enter().append("circle")
        .attr("class", "circle")
        .attr("cx", product => xScaleScatterPlot(product.countInStock))
        .attr("cy", product => yScaleScatterPlot(product.countInStock))
        .attr("r", 5);
  
    // Add text labels to the circles
    chartGroupScatterPlot.selectAll(".text-label")
        .data(products)
        .enter().append("text")
        .attr("class", "text-label")
        .attr("x", product => xScaleScatterPlot(product.countInStock) + 7)
        .attr("y", product => yScaleScatterPlot(product.countInStock) - 7)
        .text(product => product.name);
  
  });
  
  
  // Define the dimensions of the SVG canvas
  const width = 1800; // גודל ה-SVG גדל ל-800
  const height = 400;
  
  // Create the SVG element
  const svg = d3.select("#chart")
      .attr("width", width)
      .attr("height", height);
  
  // Define the margins for the chart
  const margin = { top: 20, right: 30, bottom: 50, left: 40 }; // שינוי בהגדרת הרגל תחתון
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Create scales for X and Y values
  const xScale = d3.scaleBand()
      .range([0, innerWidth])
      .padding(0.1);
  
  const yScale = d3.scaleLinear()
      .range([innerHeight, 0]);
  
  // Create the chart group
  const chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Load data from MongoDB
  d3.json("http://localhost:3330/api/store-products", function(error, data) {
      if (error) throw error;
  
      // Create an array of product names and their corresponding prices
      const products = data.map(item => ({ name: item.name, price: item.price }));
  
      // Set domains for X and Y scales
      xScale.domain(products.map(product => product.name));
      yScale.domain([0, d3.max(products, product => product.price)]);
  
      // Create X and Y axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
  
      chartGroup.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0,${innerHeight})`)
          .call(xAxis);
  
      chartGroup.append("g")
          .attr("class", "y-axis")
          .call(yAxis);
  
      // Create bars for the products
      chartGroup.selectAll(".bar")
          .data(products)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", product => xScale(product.name))
          .attr("y", product => yScale(product.price))
          .attr("width", xScale.bandwidth())
          .attr("height", product => innerHeight - yScale(product.price));
  });




  const productsTable = document.getElementById('productsTable').getElementsByTagName('tbody')[0];

async function fetchProductData() {
  const response = await fetch('/api/products');
  const data = await response.json();
  return data;
}

async function renderProductsTable() {
  const productData = await fetchProductData();
  productData.forEach(product => {
    const row = productsTable.insertRow();
    row.setAttribute('data-id', product._id); // Set the data-id attribute for the row
    const idCell=row.insertCell(0);
    const nameCell = row.insertCell(1);
    const imageCell = row.insertCell(2);
    const brandCell = row.insertCell(3);
    const categoryCell = row.insertCell(4);
    const countInStockCell = row.insertCell(5);
    const ratingCell = row.insertCell(6);
    const numReviewsCell = row.insertCell(7);
    const descriptionCell = row.insertCell(8);
    const colorCell = row.insertCell(9);
    const popularityCell = row.insertCell(10);
    const deleteCell = row.insertCell(11);


    idCell.textContent = product._id;
    nameCell.textContent = product.name;
    imageCell.textContent = product.image;
    brandCell.textContent = product.brand;
    categoryCell.textContent = product.category;
    countInStockCell.textContent = product.countInStock;
    ratingCell.textContent = product.rating;
    numReviewsCell.textContent = product.numReviews;
    descriptionCell.textContent = product.description;
    colorCell.textContent = product.color;
    popularityCell.textContent = product.popularity;
    
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('data-id', product._id); // Set the data-id attribute
    deleteButton.addEventListener('click', () => deleteProduct(product._id)); // Pass product ID
   
    deleteCell.appendChild(deleteButton);


  });
}

// Function to delete a product
async function deleteProduct(productId) {
    try {
      const response = await fetch(`/api/store-products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      console.log(data);
      if (data.success) {
      
        // Remove the deleted product from the table and re-render the table
        const deletedRow = productsTable.querySelector(`[data-id="${productId}"]`);
        if (deletedRow) {
          productsTable.removeChild(deletedRow);
        }
      } else {
        console.error('Failed to delete product.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

renderProductsTable();