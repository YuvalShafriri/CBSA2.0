import { betweenness, degree } from "graphology-metrics/centrality";

// Rest of your code...

// Rest of your code

const width = window.innerWidth;
const height = window.innerHeight;
console.log(width, height);
let initialX = 0;
let initialY = 0; // These will be used to store the initial click position
let accumulatedTranslation = { x: 0, y: 0 }; //
const jsonFile = "data.json";

function linkDistance(d) {
  // This function determines the distance between the nodes based on the relation.
  switch (d.relation) {
    case "Contains":
      return 50;
    case "Includes":
      return 70;
    case "Depicts":
      return 90;
    //... add more cases as needed
    default:
      return 110; // default distance
  }
}

function hideLabels() {
  d3.select("#linkInfo").remove(); // If you're using IDs like "linkInfo" for the link labels.
  d3.select("#nodeInfo").remove(); // If you're using IDs like "nodeInfo" for the node labels.
  // // Continue for any other labels you might have...
}

function appendCircularImage(nodeGroup, id, url) {
  nodeGroup
    .filter((d) => d.id === id)
    .append("image")
    .attr("xlink:href", url)
    .attr("width", 40)
    .attr("height", 40)
    .attr("transform", "translate(-18, -18)") // This centers the image.
    .attr("clip-path", "url(#circleClip)"); // This makes the image appear circular.
}

function dragstarted(event, d) {
  console.log("drag started");
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
  svg.on(".zoom", null);  // Disable zooming while dragging
}

function dragged(event, d) {
  console.log("dragging");
  d.fx = event.x;
  d.fy = event.y;
}

// function dragended(event, d) {
//   if (!event.active) simulation.alphaTarget(0);
//   d.fx = null;
//   d.fy = null;
//   // Remove the displayed type name after dragging
//   d3.select("#nodeInfo").remove();
// }
// Data
function dragended(event, d) {
  console.log("drag ended");
  if (!event.active) simulation.alphaTarget(0);
 // if (!d.fixed) {
    // Only set fx and fy to null if the node isn't fixed
    d.fx = null;
    d.fy = null;
  //}
  svg.call(zoomHandler);  
}

d3.json(jsonFile).then((data) => {
  /* centrality degree
  // Assuming you've loaded your data into a variable called `data`*/
  let graph = new graphology.Graph();

  // Add nodes and edges to the graph instance
  data.nodes.forEach((node) => {
    graph.addNode(node.id, { label: node.label });
  });

  data.links.forEach((link) => {
    graph.addEdge(link.source, link.target);
  });

  // Compute the degree centrality of the graph
  let maxDegree = -1;
  let maxDegreeNode = null;

  graph.forEachNode((node, attributes) => {
    const degree = graph.degree(node);
    if (degree > maxDegree) {
      maxDegree = degree;
      maxDegreeNode = node;
    }
  });

  console.log(
    `Node with maximum degree: ${maxDegreeNode} with degree of ${maxDegree}`
  );
  let degreeList = [];

  graph.forEachNode((node, attributes) => {
    const degree = graph.degree(node);
    degreeList.push({
      name: node,
      degree: degree,
    });
  });
  // sort the degreeList
  degreeList.sort((a, b) => b.degree - a.degree);
  console.log("List of nodes and their degrees:", degreeList);

  /////////////////betweenness centrality
  // Assuming you've already constructed the graph and loaded data into it

  // Calculate betweenness centrality for all nodes
  let betweennessResults = betweenness(graph);

  // The result will be an object where keys are node identifiers and values are their respective betweenness centrality scores
  console.log("Betweenness Centrality Results:", betweennessResults);

  /***** */

  const nodes = data.nodes;
  const links = data.links;
  const typeColors = data.config.typeColors;
  const relationColors = data.config.relationColors;
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    .attr("viewBox", `0 0 ${width} ${height}`)

    .style("font", "12px sans-serif");

  const zoomHandler = d3.zoom().on("zoom", (event) => {
    container.attr("transform", event.transform);
  });
  svg.call(zoomHandler);

  const container = svg.append("g");

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(linkDistance)
        .strength(0.5)
    ) // Added strength
    .force("charge", d3.forceManyBody().strength(-300)) // Increase repulsion
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(20).iterations(2)); // Add a collision force to prevent node overlap

  nodes.forEach((node) => {
    node.x = width / 2;
    node.y = height / 2;
  });

  // for (let i = 0; i < 300; ++i) simulation.tick();
  container
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("opacity", 0);

  // Links: lines and their behavior
  const link = container
    .append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 1.3)
    .attr("opacity", 0.6)
    .attr("stroke", (d) => relationColors[d.relation]);

  // Nodes: circles and their behavior
  // Node groups

  const nodeGroup = container
    .append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g");

  nodeGroup
    .append("circle")
    .attr("r", 18)
    .attr("fill", (d) => {
      if (d.id === "Jael") {
        return `url(#JaelImage)`; // This refers to a pattern defined later
      } else {
        return typeColors[d.type];
      }
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  // No standalone image addition for Jael.

  let isDragging = false;
  //
  nodeGroup.select("circle").on("mousedown", function (event) {
    event.stopPropagation();
  });

  // Now, incorporate the hideLabels function into the dragstart event of the container:
  container.call(d3.drag()
      .on("start", function (event) {
        isDragging = false;
        hideLabels(); // hide the labels when dragging starts
      })
      .on("drag", function (event) {
        accumulatedTranslation.x += event.dx;
        accumulatedTranslation.y += event.dy;
        container.attr(
          "transform",
          `translate(${accumulatedTranslation.x},${accumulatedTranslation.y})`
        );
        isDragging = true;
        d3.select("#nodeInfo").style("visibility", "hidden");
        d3.select("#nodeBackground").style("visibility", "hidden");

        // If you want to hide the link label too:
        d3.select("#linkInfo").style("visibility", "hidden");
      })
      .on("end", function (event) {
        // Any other logic you want on drag end...
      })
  );

  /**  */

  // // Usage:
  appendCircularImage(nodeGroup, "Jael", "images/yaelalef.jpg");
  appendCircularImage(nodeGroup, "Samson", "images/sam.jpg");
  appendCircularImage(nodeGroup, "Noah's Ark", "images/noahs-ark.jpg");

  // 1. First, set up a clip-path that is a circle:
  container
    .append("defs")
    .append("clipPath")
    .attr("id", "circleClip")
    .append("circle")
    .attr("cx", 18) // Center the circle.
    .attr("cy", 18)
    .attr("r", 18);

  // On click: display the entity type on the node

  nodeGroup.on("click", function (event, d) {
    if (isDragging) {
      // if we've dragged, don't process the click
      isDragging = false; // reset the flag
      return;
    }
    const hasImage = !!d3.select(this).select("image").node();

    if (!hasImage) {
      const imageUrl = prompt("Enter the URL of the image:");
      if (imageUrl) {
        appendCircularImage(d3.select(this), d.id, "images/" + imageUrl);
      }
    }
    // Clear any existing labels and backgrounds
    d3.select("#nodeInfo").remove();
    d3.select("#nodeBackground").remove();
    d3.select("#linkInfo").remove();
    // Calculate the width and height of the text.
    let textWidth = d.type.length * 6; // Assume 6px average width per character
    let textHeight = 12; // Assume 12px height for the text

    container
      .append("rect")
      .attr("x", d.x - textWidth / 2)
      .attr("y", d.y - textHeight / 2)
      .attr("x", d.x + accumulatedTranslation.x - textWidth / 2)
      .attr("y", d.y + accumulatedTranslation.y - textHeight / 2) // additional -25 to move it above node
      .attr("width", textWidth)
      .attr("height", textHeight)
      .attr("id", "nodeBackground")
      .attr("fill", "white");

    container
      .append("text")
      .attr("x", d.x)
      .attr("y", d.y)
      .attr("x", d.x + accumulatedTranslation.x)
      .attr("y", d.y + accumulatedTranslation.y) // adjusted
      .attr("dy", "0.35em") // Center the text vertically in the rectangle
      .attr("id", "nodeInfo")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "11px")
      .text(d.type);
  });
  const labels = container
    .append("g")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("dy", "-20") // Moved closer to the node
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .text((d) => {
      const words = d.id.split(" ");
      if (words.length > 1) {
        return words[0] + "\n" + words[1];
      } else {
        return d.id;
      }
    });

  // Update positions dynamically as simulation progresses

  simulation.on("tick", function () {
    link
      .attr("x1", (d) => d.source.x + accumulatedTranslation.x)
      .attr("y1", (d) => d.source.y + accumulatedTranslation.y)
      .attr("x2", (d) => d.target.x + accumulatedTranslation.x)
      .attr("y2", (d) => d.target.y + accumulatedTranslation.y);

    nodeGroup
      .attr("cx", (d) => Math.max(18, Math.min(width - 18, d.x)))
      .attr("cy", (d) => Math.max(18, Math.min(height - 18, d.y)))

      .attr(
        "transform",
        (d) =>
          `translate(${d.x + accumulatedTranslation.x}, ${
            d.y + accumulatedTranslation.y
          })`
      );

    labels
      .attr("x", (d) => d.x + accumulatedTranslation.x)
      // .attr("y", d => d.y + accumulatedTranslation.y - 20);  // added "-20" to adjust for the offset you set earlier
      .attr("y", (d) => d.y + accumulatedTranslation.y);
  });

  // Drag functionality

  link.on("mousemove", function (event, d) {
    d3.select("#linkInfo").remove();

    // Getting the actual SVG line element
    const line = this;

    // Using getAttribute to get the positions directly from the SVG
    const x1 = parseFloat(line.getAttribute("x1"));
    const x2 = parseFloat(line.getAttribute("x2"));
    const y1 = parseFloat(line.getAttribute("y1"));
    const y2 = parseFloat(line.getAttribute("y2"));

    // Calculate the midpoint
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    let yOffset = "-0.5em";
    let rotateText = 0;

    if (angle <= -90 || angle > 90) {
      rotateText = 180;
    }

    container
      .append("text")
      .attr("x", midX)
      .attr("y", midY)
      .attr("dy", yOffset)
      .attr("id", "linkInfo")
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .attr("transform", `rotate(${angle + rotateText}, ${midX}, ${midY})`)
      .text(d.relation);
  });
}); //////

/**/
