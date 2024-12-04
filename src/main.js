//ver 1.0.0

import * as graphAnalysis from './graphAnalysis.js';
 
import SimpleNetwork from './SimpleNetwork.js';

let network;

function createNewGraph(data) {
    if (network) {
         network = null;
        // Optional: If there are cleanup tasks to be done before creating a new instance, do them here.
    }
    network = new SimpleNetwork('body', data);
}

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

 
  //createNewGraph(defaultData);


// //console.log("main")  
// graphAnalysis.centrality(dataFileName).then(result => {
//     console.log("Degree Centrality Results:", result);
// });

// graphAnalysis._betweenness(dataFileName).then(result => {
//     console.log("Betweenness Centrality Results:", result);
// });
// // graphAnalysis.closeness(dataFileName).then(result => {   
  