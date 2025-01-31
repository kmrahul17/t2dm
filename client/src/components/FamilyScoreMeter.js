import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function FamilyScoreMeter({ score }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 200;
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const radius = Math.min(width - margin.left - margin.right, 
                          (height - margin.top - margin.bottom)) / 4;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const gaugeGroup = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const scale = d3.scaleLinear()
      .domain([0, 2])
      .range([-0.75 * Math.PI, 0.75 * Math.PI]);

    const segments = [
      { start: 0, end: 1, color: '#32CD32' }, // Green for 0/2
      { start: 1, end: 2, color: '#FFA500' }, // Orange for 1/2
      { start: 2, end: 3, color: '#FF4500' }  // Red for 2/2
    ];

    const backgroundArc = d3.arc()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(-0.75 * Math.PI)
      .endAngle(0.75 * Math.PI);

    gaugeGroup.append("path")
      .attr("d", backgroundArc)
      .attr("fill", "#E0E0E0");

    segments.forEach(segment => {
      const segmentArc = d3.arc()
        .innerRadius(radius - 20)
        .outerRadius(radius - 10)
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
      .attr("r", 10)
      .attr("fill", "black");

    gaugeGroup.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 8)
      .attr("fill", "white");

    // Add needle
    const needleLength = radius - 25;
    const angle = scale(score + 0.5);

    const needle = gaugeGroup.append("g")
      .attr("transform", `rotate(${angle * 180 / Math.PI - 90})`);

    const baseWidth = 20;
    const tipWidth = 5;
    const arrowPath = `M0,${-tipWidth / 2} L${needleLength},0 L0,${tipWidth / 2} L0,${baseWidth / 2} L0,-${baseWidth / 2} Z`;

    needle.append("path")
      .attr("d", arrowPath)
      .attr("fill", "#FF0000");

    // Display score
    gaugeGroup.append("text")
      .attr("x", 0)
      .attr("y", radius / 2 + 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text(`Score: ${score}/2`);

  }, [score]);

  return (
    <div className="family-score-meter-wrapper" style={{ overflow: 'visible' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default FamilyScoreMeter;
