//ver dev 1.0 default 


// Assuming you have the necessary imports at the top of your file
import SimpleNetwork from './SimpleNetwork.js';
import * as d3 from 'd3'; // If you haven't imported it yet

let network; // Declare network variable

async function loadDefaultData() {
    try {
        const defaultData = await d3.json('./data/data.json');
        createNewGraph(defaultData);
    } catch (error) {
        console.error("Error loading the default JSON data", error);
    }
}

function createNewGraph(data) {
    // Explicitly check for an existing network instance
    if (network) {
        // You mentioned you handle SVG removal in SimpleNetwork, so we don't need to do it here.
        // But just for reference: d3.select("svg").remove();
        network = null;
    }

    network = new SimpleNetwork('body', data); // Create a new instance with the new data
}

document.addEventListener("DOMContentLoaded", function(event) {
    const dataFileInput = document.getElementById('dataFileInput');

    dataFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const newData = JSON.parse(event.target.result);
                createNewGraph(newData);
            };
            reader.readAsText(file);
        }
    });

    // Call the function to load and render the default data when the page loads
    loadDefaultData();
});




// import * as graphAnalysis from './graphAnalysis.js';
 
// import SimpleNetwork from './SimpleNetwork.js';

// let network;

// function createNewGraph(data) {
//     if (network) {
//          network = null;
//         // Optional: If there are cleanup tasks to be done before creating a new instance, do them here.
//     }
//     network = new SimpleNetwork('body', data);
// }

// const dataFileInput = document.getElementById('dataFileInput');

// dataFileInput.addEventListener('change', (event) => {
     
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function(event) {
//             const newData = JSON.parse(event.target.result);
//             createNewGraph(newData);
//         };
//         reader.readAsText(file);
//     }
// });

 
  //createNewGraph(defaultData);


// //console.log("main")  
// graphAnalysis.centrality(dataFileName).then(result => {
//     console.log("Degree Centrality Results:", result);
// });

// graphAnalysis._betweenness(dataFileName).then(result => {
//     console.log("Betweenness Centrality Results:", result);
// });
// // graphAnalysis.closeness(dataFileName).then(result => {   
  