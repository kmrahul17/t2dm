// src/components/BMIMeter.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


function BMIMeter({ bmi, category }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current || !bmi) return;

    const width = 500;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 40 };
    const radius = Math.min(width - margin.left - margin.right, 
                          (height - margin.top - margin.bottom)) / 1.3;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const gaugeGroup = svg.append("g")
      .attr("transform", `translate(${width/2},${height/2 + 30})`);

    const scale = d3.scaleLinear()
      .domain([0, 50])
      .range([-0.75 * Math.PI, 0.75 * Math.PI]);

      const segments = [
        { start: 0, end: 16, color: '#FF0000' },
        { start: 16, end: 17, color: '#FF6347' },
        { start: 17, end: 18.5, color: '#FFA500' },
        { start: 18.5, end: 24.9, color: '#32CD32' },
        { start: 24.9, end: 29.9, color: '#FFD700' },
        { start: 29.9, end: 34.9, color: '#FF8C00' },
        { start: 34.9, end: 39.9, color: '#FF4500' },
        { start: 39.9, end: 50, color: '#8B0000' }
      ];

    const backgroundArc = d3.arc()
      .innerRadius(radius - 40)
      .outerRadius(radius)
      .startAngle(-0.75 * Math.PI)
      .endAngle(0.75 * Math.PI);

    gaugeGroup.append("path")
      .attr("d", backgroundArc)
      .attr("fill", "#E0E0E0");

    segments.forEach(segment => {
      const segmentArc = d3.arc()
        .innerRadius(radius - 40)
        .outerRadius(radius - 15)
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
    const needleLength = radius - 45;
    const angle = scale(Math.min(Math.max(bmi, 0), 50));

    const needle = gaugeGroup.append("g")
      .attr("transform", `rotate(${angle * 180 / Math.PI - 90})`);

    const baseWidth = 30;
    const tipWidth = 5;
    const arrowPath = `M0,${-tipWidth / 2} L${needleLength},0 L0,${tipWidth / 2} L0,${baseWidth / 2} L0,-${baseWidth / 2} Z`;

    needle.append("path")
      .attr("d", arrowPath)
      .attr("fill", "#FF0000");

    // Display BMI value and category
    gaugeGroup.append("text")
      .attr("x", 0)
      .attr("y", radius / 2 + 22)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text(`BMI: ${bmi.toFixed(1)}`);

    gaugeGroup.append("text")
      .attr("x", 0)
      .attr("y", radius / 2 + 42)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("fill", "#FF4500")
      .text(category);

  }, [bmi, category]);

  return (
    <div className="bmi-meter-wrapper">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default BMIMeter;