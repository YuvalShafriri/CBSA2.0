import * as d3 from 'd3';

export default class SimpleNetwork {
    constructor(selector, data) {
        this.selector = selector;
        this.data = data;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.collisionForce = d3.forceCollide().radius(50);
        this.init();

      
        
    }

    async init() {
        const data = this.data ;
        this.createSvg();
        this.loadData(data);
        this.createForceSimulation();
        this.createElements();
        this.setupZoom();
        this.setupDrag();

        this.addEventListeners();
    }

    createSvg() {
        if (d3.select(this.selector).select("svg").node()) {
            d3.select(this.selector).select("svg").remove();
        }

        this.svg = d3.select(this.selector)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('font', '12px sans-serif');
    }

    loadData(data) {
        this.nodes = data.nodes;
        this.links = data.links;
        this.config = data.config;
        // console.log("load..Data", this.nodes, this.links, this.config);
    }

    createForceSimulation() {
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(90)) // set your desired distance here
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force("collision", this.collisionForce)
            .on('tick', () => this.tick());
    }


    createElements() {
        const container = this.svg.append('g');
        this.container = container;

        // Create links
        this.link = container.append('g')
            .selectAll('line')
            .data(this.links)
            .enter()
            .append('line')
            .attr('stroke-width', 1.3)
            .attr('opacity', 0.6)
            .attr('stroke', d => this.config.relationColors[d.relation] || '#000'); // Default to black if relation not found

        // Create nodes

        // this.node = container.append('g')
        //     .selectAll('circle')
        //     .data(this.nodes)
        //     .enter()
        //     .append('circle')
        //     .attr('r', 20)
        //     .attr('fill', d => this.config.typeColors[d.type] || '#1f78b4'); // Default to example color if type not found

        // this.node.append('text')
        // .attr('x', 0)
        // .attr('y', 0)
        //     .attr('dy', ".35em") // this centers the text vertically
        //     .style('font-size', '8px') // small font size
        //     .style('text-anchor', 'middle')
        //     .style('fill', 'black')
        //     .attr('fill', 'black')
        //     .text(d => d.type); // assuming `type` is the property with your entity type
        this.nodeGroup = container.append('g').selectAll('g').data(this.nodes).enter().append('g');

        this.node = this.nodeGroup.append('circle')
            .attr('r', 20)
            .attr('fill', d => this.config.typeColors[d.type] || '#1f78b4');
        
        this.nodeGroup.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', ".35em")
            .style('font-size', '8px')
            .style('text-anchor', 'middle')
            .style('fill', 'black')
            .text(d => d.type);
        
        this.label = container.append('g')
            .selectAll('text')
            .data(this.nodes)
            .enter()
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('fill', '#000')  // Choose desired color
            .attr('dy', '-25')
            .attr('font-size', '9px') // Smaller font size for link labels    // Adjust distance above the circle
            .attr('opacity', 1)

            .text(d => d.id);

        // Create link labels
        this.linkLabel = container.append('g')
            .selectAll('text')
            .data(this.links)
            .enter()
            .append('text')
            .text(d => d.relation) // Assuming 'relation' is what you want to display. Adjust accordingly.
            .attr('font-size', '8px') // Smaller font size for link labels
            .attr('text-anchor', 'middle');
    }

    setupZoom() {
        const zoomHandler = d3.zoom().on('zoom', (event) => {
            this.container.attr('transform', event.transform);
        });
        this.svg.call(zoomHandler);
    }
    setupDrag() {
        const dragHandler = d3.drag()
            .on('start', this.dragstarted.bind(this))
            .on('drag', this.dragged.bind(this))
            .on('end', this.dragended.bind(this));

        this.node.call(dragHandler);
    }




    addEventListeners() {
        // Add any event listeners (e.g., click, mouseover) here
    }

    // Dragging Functions
    dragstarted(event) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    dragended(event) {
        if (!event.active) this.simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    // Update positions
    tick() {
        // Update link positions
        this.link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        // Update node positions
        // this.node
        //     .attr('cx', d => d.x)
        //     .attr('cy', d => d.y);
        this.nodeGroup.attr('transform', d => `translate(${d.x}, ${d.y})`);


        //Update label positions
        this.label
            .attr('x', d => d.x)
            .attr('y', d => d.y);

        // Inside the tick function:


        this.linkLabel
            .attr('x', function (d) { return (d.source.x + d.target.x) / 2; })
            .attr('y', function (d) {
                return (d.source.y + d.target.y) / 2;
            })
            .attr('transform', function (d) {
                let xMid = (d.source.x + d.target.x) / 2;
                let yMid = (d.source.y + d.target.y) / 2;
                let dx = d.target.x - d.source.x;
                let dy = d.target.y - d.source.y;
                let angle = Math.atan2(dy, dx) * (180 / Math.PI);

                // Adjust the position and rotation based on the angle
                if (angle > 90 || angle < -90) {
                    angle -= 180;
                }
                return `rotate(${angle}, ${xMid}, ${yMid}) translate(0, -5)`;

            });
    }
}
