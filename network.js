// links.forEach(function(link) {
//     link.source = nodes[link.source];
//     link.target = nodes[link.target];
// });

var width = 1200,
    height = 700;


var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);


var force = d3.forceSimulation()
  .nodes(d3.values(nodes))
  .force("link",
    d3.forceLink(links)
      .id(function(d) {return d.name;})
      .distance(function(d) {
        return (d.direction == 'u' ? 60 : 400);
      })
  )
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force("x", d3.forceX())
  .force("y", d3.forceY())
  .force("charge", d3.forceManyBody().strength(-250))
  .alphaTarget(1)
  .on("tick", tick);

// add the links and the arrows

var path = svg.append("g")
  .selectAll("path")
  .data(links)
  .enter()
.append("path")
  .attr("class", function(d){return "link direction-" + d.direction;});

// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
    .enter()
  .append("g")
    .attr("class", "node")
    .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

// add the nodes
node.append("circle")
  .attr("r", function(d){return 3*Math.sqrt(d.size);})
  .on("dblclick", function(d){
    d.fixed = !d.fixed;
    if(d.fixed)
    {
      d.fx = d.x;
      d.fy = d.y;
    } else
    {
      d.fx = null;
      d.fy = null;
    }
    d3.select(this).classed("fixed", d.fixed);
  });


node.append("text")
  .text(function(d){return d.name;})
  .attr("dx", 10)
  .attr("dy", -10);


// add the curvy lines
function tick() {
  path.attr("d", function(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" +
      d.source.x + "," +
      d.source.y + "A" +
      dr + "," + dr + " 0 0,1 " +
      d.target.x + "," +
      d.target.y;
  });
  node.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";});
}

function dragstarted(d) {
      if (!d3.event.active) force.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if(!d3.event.active) force.alphaTarget(0);
  if(d.fixed == true){
    d.fx = d.x;
    d.fy = d.y;
  } else{
    d.fx = null;
    d.fy = null;
  }
}
