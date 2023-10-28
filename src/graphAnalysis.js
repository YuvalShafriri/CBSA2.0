/*graphAnalysis.js*/
import { betweenness, degree } from "graphology-metrics/centrality";
import Graph from 'graphology';
import { json } from 'd3';
console.log("graphAnalysis.js")
export async function centrality(data) {
//    const data = await json(data);
//    const data = await json(data);
    let graph = new Graph();
    //... implementation for centrality using degree or betweenness
    data.nodes.forEach((node) => {
        graph.addNode(node.id, { label: node.label });
    });
    data.links.forEach((link) => {
        graph.addEdge(link.source, link.target);
    });
    // Compute the degree centrality of the graph
    let maxDegree = -1;
    let maxDegreeNode = null;
    graph.forEachNode((node_2, attributes) => {
        const degree = graph.degree(node_2);
        if (degree > maxDegree) {
            maxDegree = degree;
            maxDegreeNode = node_2;
        }
    });
    console.log(
        `Node with maximum degree: ${maxDegreeNode} with degree of ${maxDegree}`
    );
    let degreeList = [];
    graph.forEachNode((node_4, attributes_1) => {
        const degree_1 = graph.degree(node_4);
        degreeList.push({
            name: node_4,
            degree: degree_1,
        });
    });

    // sort the degreeList
    degreeList.sort((a, b) => b.degree - a.degree);
    return degreeList;

// ... other analysis functions
}
// export function _betweenness(data) {
//     //... implementation for betweenness
//     let graph = new Graph()


//   // Add nodes and edges to the graph instance
//   data.nodes.forEach((node) => {
//     graph.addNode(node.id, { label: node.label });
//   });

//   data.links.forEach((link) => {
//     graph.addEdge(link.source, link.target);
//   });

  
//   // Calculate betweenness centrality for all nodes
//    let betweennessResults = betweenness(graph);

//   return betweennessResults;

//   // The result will be an object where keys are node identifiers and values are their respective betweenness centrality scores
  
// }
export async function _betweenness(data) {
  //  const data = await json(dataFileName);
    // ... your betweenness logic here using the 'data'
    // return the results
    //... implementation for betweenness
    let graph = new Graph();
    // Add nodes and edges to the graph instance
    data.nodes.forEach((node) => {
        graph.addNode(node.id, { label: node.label });
    });
    data.links.forEach((link) => {
        graph.addEdge(link.source, link.target);
    });
    // Calculate betweenness centrality for all nodes
    let betweennessResults = betweenness(graph);
    return betweennessResults;
}