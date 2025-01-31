import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const EGFRGauge = ({ eGFRValue }) => {
  const ref = useRef();

  // Function to classify eGFR stages
  const classifyEGFR = (value) => {
    if (value >= 90) return 'G1: Normal or High (≥ 90)';
    if (value >= 60) return 'G2: Mildly Decreased (60–89)';
    if (value >= 45) return 'G3a: Mildly to Moderately Decreased (45–59)';
    if (value >= 30) return 'G3b: Moderately to Severely Decreased (30–44)';
    if (value >= 15) return 'G4: Severely Decreased (15–29)';
    return 'G5: Kidney Failure (< 15)';
  };

  useEffect(() => {
    const width = 300;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 20 };
    const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 3.2;

    // Clear previous SVG content
    d3.select(ref.current).selectAll('*').remove();

    const svg = d3.select(ref.current)
      .attr('width', '100%')
      .attr('height', '30%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const gaugeGroup = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2 + 10})`);

    // Define scale and arc
    const scale = d3.scaleLinear().domain([0, 120]).range([-0.75 * Math.PI, 0.75 * Math.PI]);

    const segments = [
      { start: 0, end: 15, color: '#8B0000' },
      { start: 15, end: 30, color: '#FF4500' },
      { start: 30, end: 45, color: '#FF8C00' },
      { start: 45, end: 60, color: '#FFD700' },
      { start: 60, end: 90, color: '#32CD32' },
      { start: 90, end: 120, color: '#228B22' }
    ];

    const backgroundArc = d3.arc()
      .innerRadius(radius - 30)
      .outerRadius(radius)
      .startAngle(-0.75 * Math.PI)
      .endAngle(0.75 * Math.PI);

    gaugeGroup.append('path')
      .attr('d', backgroundArc)
      .attr('fill', '#E0E0E0');

    // Draw colored segments
    segments.forEach(segment => {
      const segmentArc = d3.arc()
        .innerRadius(radius - 30)
        .outerRadius(radius - 10)
        .startAngle(scale(segment.start))
        .endAngle(scale(segment.end));

      gaugeGroup.append('path')
        .attr('d', segmentArc)
        .attr('fill', segment.color);
    });

    // Add needle
    const needleLength = radius - 25;
    const angle = scale(Math.min(Math.max(eGFRValue, 0), 120));

    const needle = gaugeGroup.append('g')
      .attr('transform', `rotate(${angle * 180 / Math.PI - 90})`);

    const baseWidth = 30;
    const tipWidth = 15;
    const arrowPath = `M0,${-tipWidth / 2} L${needleLength},0 L0,${tipWidth / 2} L0,${baseWidth / 2} L0,-${baseWidth / 2} Z`;

    needle.append('path')
      .attr('d', arrowPath)
      .attr('fill', '#FF0000');

    // Add center circle decoration
    gaugeGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 15)
      .attr('fill', 'black');

    gaugeGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 12)
      .attr('fill', 'white');

    // Display eGFR value and category
    gaugeGroup.append('text')
      .attr('x', 0)
      .attr('y', radius / 2 + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(`${eGFRValue.toFixed(1)} mL/min/1.73m²`);

    gaugeGroup.append('text')
      .attr('x', 0)
      .attr('y', radius / 2 + 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#FF4500')
      .text(classifyEGFR(eGFRValue));
  }, [eGFRValue]);

  return (
    <div className="egfr-meter-wrapper">
      <svg ref={ref}></svg>
    </div>
  );
};

export default EGFRGauge;