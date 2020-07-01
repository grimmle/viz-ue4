let nodeColor = "rgba(82, 186, 162, 0.95)";
let highlightColor = "rgba(150, 0, 0,0.95)";
let linkColor = "rgba(27, 40, 41, 0.8)";

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

d3.json("data.json", function (error, graph) {
    if (error) throw error;
    var simulation = d3.forceSimulation()
        .nodes(graph.nodes)
        .force("link", d3.forceLink(graph.links).distance(70))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2));        

    simulation
        .on("tick", ticked)
        .force("link")
        .links(graph.links)

    var g = svg.append("g")
        .attr("class", "everything");


    var link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) { return Math.sqrt(d.weight); })
        .style("stroke", linkColor);

    var node = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter().append("g")

    var circles = node.append("circle")
        .attr("r", (d) => getRadius(d.id))
        .attr("fill", nodeColor)
        .attr("class", function (d) {return d.name.toLowerCase()})

    node.append("title")
        .text(function (d) { return d.name; });

    var handleDrag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

    handleDrag(node);
    
    var handleZoom = d3.zoom()
        .on("zoom", zoom_actions);

    handleZoom(svg);

    function zoom_actions() {
        g.attr("transform", d3.event.transform)
    }

    var lables = node.append("text")
        .text(function (d) {return d.name;})
        .style("text-anchor", "middle")

    node.append("title")
        .text(function (d) { return d.id; });

    
    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
    }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function getRadius(id) {
        let radius = 8;
        let links = graph.links.filter((link) => parseInt(link.source.id) == id);
        
        links.forEach(link => {
            //take multiple connections into account?
            //radius += link.weight
            radius += 1
        });
        return radius
    }
});

function search() {
    let query = document.getElementById("search").value;
    console.log(query)
    d3.select("." + query)
        .attr("fill", highlightColor)
}