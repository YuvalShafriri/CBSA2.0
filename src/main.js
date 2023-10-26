import Visualization from './visualization.js';
import * as graphAnalysis from './graphAnalysis.js';
// const width = window.innerWidth;
// const height = window.outerHeight;
const dataFileName = './data/data.json';
import SimpleNetwork from './SimpleNetwork.js';

const network = new SimpleNetwork('body', dataFileName);

  
// //console.log("main")  
// graphAnalysis.centrality(dataFileName).then(result => {
//     console.log("Degree Centrality Results:", result);
// });

// graphAnalysis._betweenness(dataFileName).then(result => {
//     console.log("Betweenness Centrality Results:", result);
// });
// // graphAnalysis.closeness(dataFileName).then(result => {   
  