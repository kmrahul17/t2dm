import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BPMeter({ systolic, category }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current || !systolic) return;

    const width = 800;
    const height = 800;
    const margin = { top: 100, right: 100, bottom: 100, left: 100 };
    const radius = Math.min(width - margin.left - margin.right, 
                          (height - margin.top - margin.bottom)) / 1.5;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const gaugeGroup = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const scale = d3.scaleLinear()
      .domain([0, 200])
      .range([-0.75 * Math.PI, 0.75 * Math.PI]);

    const segments = [
      { start: 0, end: 90, color: '#FF0000' },
      { start: 90, end: 120, color: '#32CD32' },
      { start: 120, end: 130, color: '#FFD700' },
      { start: 130, end: 140, color: '#FFA07A' },
      { start: 140, end: 160, color: '#FF4500' },
      { start: 160, end: 180, color: '#FF4500' },
      { start: 180, end: 200, color: '#8B0000' }
    ];

    const backgroundArc = d3.arc()
      .innerRadius(radius - 50)
      .outerRadius(radius)
      .startAngle(-0.75 * Math.PI)
      .endAngle(0.75 * Math.PI);

    gaugeGroup.append("path")
      .attr("d", backgroundArc)
      .attr("fill", "#E0E0E0");

    segments.forEach(segment => {
      const segmentArc = d3.arc()
        .innerRadius(radius - 50)
        .outerRadius(radius - 25)
        .startAngle(scale(segment.start))
        .endAngle(scale(segment.end));

      gaugeGroup.append("path")
        .attr("d", segmentArc)
        .attr("fill", segment.color);
    });

    // Add center decoration
    gaugeGroup.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 20)
      .attr("fill", "black");

    gaugeGroup.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 16)
      .attr("fill", "white");

    // Add needle
    const needleLength = radius - 30;
    const angle = scale(Math.min(Math.max(systolic, 0), 200));

    const needle = gaugeGroup.append("g")
      .attr("transform", `rotate(${angle * 180 / Math.PI - 90})`);

    const baseWidth = 40;
    const tipWidth = 10;
    const arrowPath = `M0,${-tipWidth / 2} L${needleLength},0 L0,${tipWidth / 2} L0,${baseWidth / 2} L0,-${baseWidth / 2} Z`;

    needle.append("path")
      .attr("d", arrowPath)
      .attr("fill", "#FF0000");

    // Display BP value and category
    gaugeGroup.append("text")
      .attr("x", 0)
      .attr("y", radius / 2 + 22)
      .attr("text-anchor", "middle")
      .attr("font-size", "40px")
      .attr("font-weight", "bold")
      .text(`BP: ${systolic} mm Hg`);

    gaugeGroup.append("text")
      .attr("x", 0)
      .attr("y", radius / 2 + 52)
      .attr("text-anchor", "middle")
      .attr("font-size", "30px")
      .attr("font-weight", "bold")
      .attr("fill", "#FF4500")
      .text(category);

  }, [systolic, category]);

  return (
    <div className="bp-meter-wrapper" style={{ overflow: 'visible' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default BPMeter;
