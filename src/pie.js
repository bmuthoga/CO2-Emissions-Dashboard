function createPie(width, height) {
  let pie = d3.select('#pie')
                .attr('width', width)
                .attr('height', height)

  pie
    .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2 + 10})`)
      .classed('chart', true)

  pie
    .append('text')
      .attr('x', width / 2)
      .attr('y', '1em')
      .attr('font-size', '1.5em')
      .style('text-anchor', 'middle')
      .classed('pie-title', true)

  drawLegend(pie, width, height)
}

function drawLegend(pie, width, height) {
  let legend = pie
                .append('g')
                .attr('transform', `translate(${width * 4/5}, ${height / 2 - 60})`)
                .classed('legend', true)
  legend
    .append('text')
    .classed('legend-title', true)
    .text('Legend')
    .attr('x', '-5px')

  let continents = [
    { name: 'africa', fill: '#26a69a' },
    { name: 'americas', fill: '#42a5f5' },
    { name: 'asia', fill: '#ab47bc' },
    { name: 'europe', fill: '#7e57c2' },
    { name: 'oceania', fill: '#78909c' }
  ]

  continents.forEach((obj, idx) => {
    legend
      .append('rect')
      .classed(obj.name, true)
      .attr('stroke-width', '1px')
      .attr('stroke', '#000')
      .attr('fill', obj.fill)
      .attr('width', '10px')
      .attr('height', '10px')
      .attr('x', '-20px')
      .attr('y', `${20 * idx + 20}px`)

    legend
      .append('text')
      .text(`${obj.name[0].toUpperCase()}${obj.name.slice(1)}`)
      .attr('y', `${20 * idx + 30}px`)
  })
}

function drawPie(data, currentYear) {
  let pie = d3.select('#pie')

  let arcs = d3.pie()
                .sort((a, b) => {
                  if (a.continent < b.continent) return -1
                  if (a.continent > b.continent) return 1
                  return a.emissions - b.emissions
                })
                .value(d => d.emissions)

  let path = d3.arc()
                .outerRadius(+pie.attr('height') / 2 - 50)
                .innerRadius(0)

  let yearData = data.filter(d => d.year === currentYear)

  let continents = []

  for (let i = 0; i < yearData.length; i++) {
    let continent = yearData[i].continent

    if (!continents.includes(continent)) {
      continents.push(continent)
    }
  }

  let colorScale = d3.scaleOrdinal()
                      .domain(continents)
                      .range(['#ab47bc', '#7e57c2', '#26a69a', '#42a5f5', '#78909c'])

  let update = pie
                .select('.chart')
                .selectAll('.arc')
                .data(arcs(yearData))

  update
    .exit()
    .remove()

  update
    .enter()
      .append('path')
        .classed('arc', true)
        .attr('stroke', '#dff1ff')
        .attr('stroke-width', '0.25px')
    .merge(update)
      .attr('fill', d => colorScale(d.data.continent))
      .attr('d', path)

  pie
    .select('.pie-title')
      .text(`Total emissions by continent and region, ${currentYear}`)
}
