const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGQh_Nv_DtmFplg_B82wmuN4SuNlG1fhKbOhRPlGHvnQQwgU7tc3L0lmrEzhTGp5bzEVTkNAhw1rBJ/pub?output=csv";

// Get the current page dynamically (e.g., from the URL)
const urlParams = new URLSearchParams(window.location.search);
const currentPage = urlParams.get("page") || "page1"; // Default to "page1" if no page is specified

fetch(sheetUrl)
  .then(response => response.text())
  .then(data => {
    console.log("Raw CSV Data:", data); // Debugging

    const rows = data.split("\n").slice(1); // Remove header row
    const filteredRows = rows
      .map(row => row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)) // Safer CSV parsing
      .filter(cols => cols && cols[4]?.trim().replace(/"/g, '') === currentPage); // Filter by Page column

    let output = "";
    filteredRows.forEach(cols => {
      output += `
        <div class="product">
          <img src="${cols[0].replace(/"/g, '')}" alt="${cols[1].replace(/"/g, '')}">
          <h2>${cols[1].replace(/"/g, '')}</h2>
          <p>${cols[2].replace(/"/g, '')}</p>
          <p>Price: $${cols[3].replace(/"/g, '')}</p>
        </div>
      `;
    });

    document.getElementById("product-container").innerHTML = output;
  })
  .catch(error => console.error("Error loading data:", error));
