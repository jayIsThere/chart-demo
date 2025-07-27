import React, { useState, useEffect, useRef } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  LineChart, Line, ScatterChart, Scatter
} from 'recharts';
import * as d3 from 'd3';

const LibraryComparisonDemo = () => {
  const [activeLibrary, setActiveLibrary] = useState('recharts');
  const [activeChart, setActiveChart] = useState('radar');

  // D3 차트를 위한 ref들
  const d3RadarRef = useRef();
  const d3BarRef = useRef();
  const d3GaugeRef = useRef();
  const d3GroupedBarRef = useRef();
  const d3LineRef = useRef();
  const d3DotPlotRef = useRef();
  const d3SparklineRef = useRef(); // D3 스파크라인 ref 삭제

  // 샘플 데이터
  const securityData = [
    { subject: 'Netzwerksicherheit', score: 85, fullMark: 100 },
    { subject: 'Datenschtuz', score: 72, fullMark: 100 },
    { subject: 'Zugriffskontrolle', score: 90, fullMark: 100 },
    { subject: 'Physische Sicherheit', score: 65, fullMark: 100 },
    { subject: 'Menschliche Sicherheit', score: 78, fullMark: 100 },
    { subject: 'Gegenmaßnahmen', score: 55, fullMark: 100 }
  ];

  const overallScore = Math.round(securityData.reduce((sum, item) => sum + item.score, 0) / securityData.length);

  const salesData = [
    { category: 'Unsere Firma', Sicherheit: 150, Datenschutz: 120, Gegenmaßnahmen: 80 },
    { category: 'Firma A', Sicherheit: 180, Datenschutz: 140, Gegenmaßnahmen: 95 },
    { category: 'Firma B', Sicherheit: 200, Datenschutz: 160, Gegenmaßnahmen: 110 },
    { category: 'Firma C', Sicherheit: 220, Datenschutz: 180, Gegenmaßnahmen: 125 },
    { category: 'Firma D', Sicherheit: 250, Datenschutz: 200, Gegenmaßnahmen: 140 },
  ];

  const lineChartData = [
    { x: 'Jan', y: 30 },
    { x: 'Feb', y: 45 },
    { x: 'Mar', y: 40 },
    { x: 'Apr', y: 55 },
    { x: 'May', y: 50 },
    { x: 'Jun', y: 65 },
  ];

  const dotPlotData = [
    { id: 'Netzwerksicherheit', min: 20, max: 80, value: 55 },
    { id: 'Datenschtuz', min: 10, max: 70, value: 45 },
    { id: 'Zugriffskontrolle', min: 30, max: 90, value: 60 },
    { id: 'Physische Sicherheit', min: 25, max: 75, value: 40 },
  ];

  const sparklineData = [10, 25, 18, 30, 22, 15, 28, 35, 20, 27];

  // D3 레이더 차트
  const createD3Radar = () => {
    if (!d3RadarRef.current) return;

    const svg = d3.select(d3RadarRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 300;
    const margin = 50;
    const radius = Math.min(width, height) / 2 - margin;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const angleSlice = Math.PI * 2 / securityData.length;

    // 격자 그리기
    const levels = 5;
    for (let i = 0; i < levels; i++) {
      const levelRadius = radius * (i + 1) / levels;
      g.append("circle")
        .attr("r", levelRadius)
        .attr("fill", "none")
        .attr("stroke", "#CDCDCD")
        .attr("stroke-width", 1);
    }

    // 축 그리기
    securityData.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#CDCDCD")
        .attr("stroke-width", 1);

      g.append("text")
        .attr("x", x * 1.15)
        .attr("y", y * 1.15)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "12px")
        .text(d.subject);
    });

    // 데이터 영역 그리기
    const radarLine = d3.line()
      .x((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return Math.cos(angle) * (radius * d.score / 100);
      })
      .y((d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return Math.sin(angle) * (radius * d.score / 100);
      })
      .curve(d3.curveLinearClosed);

    g.append("path")
      .datum(securityData)
      .attr("d", radarLine)
      .attr("fill", "#3B82F6")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "#3B82F6")
      .attr("stroke-width", 2);
  };

  // D3 바 차트
  const createD3Bar = () => {
    if (!d3BarRef.current) return;

    const svg = d3.select(d3BarRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 80, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand()
      .domain(securityData.map(d => d.subject))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    g.selectAll(".bar")
      .data(securityData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.subject))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.score))
      .attr("height", d => height - y(d.score))
      .attr("fill", "#3B82F6");

    g.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    g.append("g")
      .call(d3.axisLeft(y));
  };

  // D3 게이지 차트
  const createD3Gauge = () => {
    if (!d3GaugeRef.current) return;

    const svg = d3.select(d3GaugeRef.current);
    svg.selectAll("*").remove();

    const width = 200;
    const height = 150;
    const radius = 80;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height - 20})`);

    const arc = d3.arc()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    // 배경 아크
    g.append("path")
      .attr("d", arc)
      .attr("fill", "#E5E7EB");

    // 점수 아크
    const scoreArc = d3.arc()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + (Math.PI * overallScore / 100));

    g.append("path")
      .attr("d", scoreArc)
      .attr("fill", "#3B82F6");

    // 점수 텍스트
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -10)
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text(overallScore);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 10)
      .style("font-size", "14px")
      .text("Punkt");
  };

  // D3 그룹형 바 차트 (간단 구현)
  const createD3GroupedBar = () => {
    if (!d3GroupedBarRef.current) return;
    const svg = d3.select(d3GroupedBarRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .padding(0.05);

    const y = d3.scaleLinear()
      .rangeRound([height, 0]);

    const z = d3.scaleOrdinal()
      .range(['#8884d8', '#82ca9d', '#ffc658']);

    const keys = ['Sicherheit', 'Datenschutz', 'Gegenmaßnahmen'];

    x0.domain(salesData.map(d => d.category));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(salesData, d => d3.max(keys, key => d[key]))]).nice();

    g.append("g")
      .selectAll("g")
      .data(salesData)
      .enter().append("g")
      .attr("transform", d => `translate(${x0(d.category)},0)`)
      .selectAll("rect")
      .data(d => keys.map(key => ({ key: key, value: d[key] })))
      .enter().append("rect")
      .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => z(d.key));

    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0));

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"));
  };

  // D3 라인 차트
  const createD3Line = () => {
    if (!d3LineRef.current) return;
    const svg = d3.select(d3LineRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scalePoint()
      .domain(lineChartData.map(d => d.x))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(lineChartData, d => d.y))
      .range([height, 0]);

    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveMonotoneX);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.append("path")
      .datum(lineChartData)
      .attr("fill", "none")
      .attr("stroke", "#3B82F6")
      .attr("stroke-width", 2)
      .attr("d", line);

    g.selectAll(".dot")
      .data(lineChartData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", 4)
      .attr("fill", "#3B82F6");
  };

  // D3 닷 플롯
  const createD3DotPlot = () => {
    if (!d3DotPlotRef.current) return;
    const svg = d3.select(d3DotPlotRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scalePoint()
      .domain(dotPlotData.map(d => d.id))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll(".dot")
      .data(dotPlotData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.id))
      .attr("cy", d => y(d.value))
      .attr("r", 6)
      .attr("fill", "#3B82F6");
  };

  // D3 스파크라인 (Nivo/Victory 스파크라인 삭제 요청으로, D3 스파크라인은 유지)
  const createD3Sparkline = () => {
    if (!d3SparklineRef.current) return;
    const svg = d3.select(d3SparklineRef.current);
    svg.selectAll("*").remove();

    const width = 200;
    const height = 50;
    const margin = 2;

    const x = d3.scaleLinear()
      .domain([0, sparklineData.length - 1])
      .range([margin, width - margin]);

    const y = d3.scaleLinear()
      .domain(d3.extent(sparklineData))
      .range([height - margin, margin]);

    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    svg.attr("width", width)
      .attr("height", height)
      .append("path")
      .datum(sparklineData)
      .attr("fill", "none")
      .attr("stroke", "#3B82F6")
      .attr("stroke-width", 2)
      .attr("d", line);
  };

  // Nivo 스타일 레이더 차트 시뮬레이션
  const NivoRadarChart = () => {
    const size = 300;
    const center = size / 2;
    const radius = 100;
    const levels = 5;

    const angleStep = (2 * Math.PI) / securityData.length;

    return (
      <div className="relative w-80 h-80 mx-auto">
        <svg width={size} height={size} className="absolute inset-0">
          {/* 격자 원들 */}
          {Array.from({ length: levels }, (_, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={(radius * (i + 1)) / levels}
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="1"
              className="animate-pulse"
            />
          ))}

          {/* 축 선들 */}
          {securityData.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#e0e0e0"
                strokeWidth="1"
              />
            );
          })}

          {/* 데이터 영역 */}
          <polygon
            points={securityData.map((d, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const distance = (radius * d.score) / 100;
              const x = center + Math.cos(angle) * distance;
              const y = center + Math.sin(angle) * distance;
              return `${x},${y}`;
            }).join(' ')}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="#3B82F6"
            strokeWidth="2"
            className="animate-pulse"
          />

          {/* 데이터 포인트 */}
          {securityData.map((d, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const distance = (radius * d.score) / 100;
            const x = center + Math.cos(angle) * distance;
            const y = center + Math.sin(angle) * distance;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#3B82F6"
                className="hover:r-6 transition-all duration-300 cursor-pointer"
              />
            );
          })}
        </svg>

        {/* 레이블들 */}
        {securityData.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + Math.cos(angle) * (radius + 30);
          const y = center + Math.sin(angle) * (radius + 30);
          return (
            <div
              key={i}
              className="absolute text-xs font-medium text-gray-700 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              {d.subject}
            </div>
          );
        })}

        {/* Nivo 스타일 애니메이션 인디케이터 */}
        <div className="absolute top-2 right-2 text-xs text-blue-500 font-bold animate-bounce">
          Nivo Style
        </div>
      </div>
    );
  };

  // Victory 스타일 레이더 차트 시뮬레이션
  const VictoryRadarChart = () => {
    const size = 300;
    const center = size / 2;
    const radius = 100;
    const angleStep = (2 * Math.PI) / securityData.length;

    return (
      <div className="relative w-80 h-80 mx-auto">
        <svg width={size} height={size} className="absolute inset-0">
          {/* Victory 스타일 배경 */}
          <rect width={size} height={size} fill="#fafafa" rx="8" />

          {/* 격자 */}
          {Array.from({ length: 5 }, (_, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={(radius * (i + 1)) / 5}
              fill="none"
              stroke="#d0d0d0"
              strokeWidth="1"
            />
          ))}

          {/* 축 */}
          {securityData.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#d0d0d0"
                strokeWidth="1"
              />
            );
          })}

          {/* Victory 스타일 데이터 영역 */}
          <polygon
            points={securityData.map((d, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const distance = (radius * d.score) / 100;
              const x = center + Math.cos(angle) * distance;
              const y = center + Math.sin(angle) * distance;
              return `${x},${y}`;
            }).join(' ')}
            fill="rgba(255, 99, 132, 0.4)"
            stroke="#FF6384"
            strokeWidth="3"
          />

          {/* Victory 스타일 포인트 */}
          {securityData.map((d, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const distance = (radius * d.score) / 100;
            const x = center + Math.cos(angle) * distance;
            const y = center + Math.sin(angle) * distance;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="5"
                fill="#FF6384"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Victory 스타일 레이블 */}
        {securityData.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + Math.cos(angle) * (radius + 35);
          const y = center + Math.sin(angle) * (radius + 35);
          return (
            <div
              key={i}
              className="absolute text-xs font-semibold text-gray-800 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              {d.subject}
            </div>
          );
        })}

        <div className="absolute top-2 right-2 text-xs text-pink-500 font-bold">
          Victory Style
        </div>
      </div>
    );
  };

  // Nivo 스타일 바 차트
  const NivoBarChart = () => (
    <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 relative overflow-hidden">
      <div className="flex items-end justify-around h-full">
        {securityData.map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-1000 hover:from-blue-700 hover:to-blue-500 hover:scale-105 cursor-pointer shadow-lg"
              style={{
                height: `${(d.score / 100) * 200}px`,
                width: '40px',
                animationDelay: `${i * 0.1}s`
              }}
            />
            <div className="text-xs mt-2 font-medium text-gray-700 text-center transform rotate-45 origin-bottom-left">
              {d.subject}
            </div>
            <div className="text-xs text-blue-600 font-bold mt-1">{d.score}</div>
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2 text-xs text-blue-500 font-bold animate-pulse">
        Nivo Style
      </div>
    </div>
  );

  // Victory 스타일 바 차트
  const VictoryBarChart = () => (
    <div className="w-full h-80 bg-gray-50 rounded-lg p-4 relative">
      <div className="flex items-end justify-around h-full">
        {securityData.map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="bg-pink-500 rounded-sm transition-all duration-500 hover:bg-pink-600 cursor-pointer"
              style={{
                height: `${(d.score / 100) * 200}px`,
                width: '35px',
                animationDelay: `${i * 0.15}s`
              }}
            />
            <div className="text-xs mt-2 font-semibold text-gray-800 text-center">
              {d.subject.split(' ')[0]}
            </div>
            <div className="text-xs text-pink-600 font-bold">{d.score}</div>
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2 text-xs text-pink-500 font-bold">
        Victory Style
      </div>
    </div>
  );

  // Nivo 스타일 라인 차트
  const NivoLineChart = () => (
    <div className="w-full h-80 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 relative">
      <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* 격자 */}
        {Array.from({ length: lineChartData.length }, (_, i) => {
          const x = (i * 100) / (lineChartData.length - 1);
          return (
            <line
              key={i}
              x1={x}
              y1={0}
              x2={x}
              y2={100}
              stroke="#e0e0e0"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          );
        })}

        <polyline
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={lineChartData
            .map((d, i) => {
              const x = (i / (lineChartData.length - 1)) * 100;
              const y = 100 - (d.y / 100) * 100;
              return `${x},${y}`;
            })
            .join(' ')}
          className="animate-draw-line"
        />

        {lineChartData.map((d, i) => {
          const x = (i / (lineChartData.length - 1)) * 100;
          const y = 100 - (d.y / 100) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="6"
              fill="#3B82F6"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="absolute top-2 right-2 text-xs text-blue-500 font-bold animate-pulse">
        Nivo Style
      </div>
    </div>
  );

  // Victory 스타일 라인 차트
  const VictoryLineChart = () => (
    <div className="w-full h-80 bg-white rounded-lg p-6 relative">
      <svg width="100%" height="100%" className="overflow-visible" viewBox="0 0 100 100">
        <polyline
          fill="none"
          stroke="#FF6384"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={lineChartData
            .map((d, i) => {
              const x = (i / (lineChartData.length - 1)) * 100;
              const y = 100 - (d.y / 100) * 100;
              return `${x},${y}`;
            })
            .join(' ')}
        />
        {lineChartData.map((d, i) => {
          const x = (i / (lineChartData.length - 1)) * 100;
          const y = 100 - (d.y / 100) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="7"
              fill="#FF6384"
              stroke="white"
              strokeWidth="3"
            />
          );
        })}
      </svg>
      <div className="absolute top-2 right-2 text-xs text-pink-500 font-bold">
        Victory Style
      </div>
    </div>
  );


  // Nivo 스타일 게이지 차트 (시뮬레이션)
  const NivoGaugeChart = () => (
    <div className="flex justify-center items-center h-48 relative">
      <div className="w-48 h-48 relative">
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-blue-300 shadow-inner">
            <span className="animate-pulse">{overallScore}</span>
          </div>
        </div>
        
        <div className="absolute top-2 right-2 text-xs text-blue-500 font-bold animate-pulse">
          Nivo Style
        </div>
      </div>
    </div>
  );

  // Victory 스타일 게이지 차트 (시뮬레이션)
  const VictoryGaugeChart = () => (
    <div className="flex justify-center items-center h-48 relative">
      <div className="w-48 h-48 relative">
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-4xl font-bold border-4 border-pink-300 shadow-inner">
            {overallScore}
          </div>
        </div>
        
        <div className="absolute top-2 right-2 text-xs text-pink-500 font-bold">
          Victory Style
        </div>
      </div>
    </div>
  );

  // Nivo/Victory 스타일 그룹형 바 차트 (시뮬레이션)
  const NivoGroupedBarChart = () => (
    <div className="w-full h-80 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 relative overflow-hidden">
      <div className="flex items-end justify-around h-full">
        {salesData.map((dataItem, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="flex" style={{ height: '200px' }}> {/* Max height for bars */}
              {['Sicherheit', 'Datenschutz', 'Gegenmaßnahmen'].map((key, i) => (
                <div
                  key={key}
                  className={`rounded-t-md transition-all duration-700 hover:scale-105 cursor-pointer shadow-md mx-0.5`}
                  style={{
                    height: `${(dataItem[key] / 250) * 100}%`, // Assuming max sales is 250
                    width: '20px',
                    backgroundColor: i === 0 ? '#8884d8' : i === 1 ? '#82ca9d' : '#ffc658',
                    animationDelay: `${idx * 0.1 + i * 0.05}s`
                  }}
                />
              ))}
            </div>
            <div className="text-xs mt-2 font-medium text-gray-700 text-center">
              {dataItem.category}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2 text-xs text-blue-500 font-bold animate-pulse">
        Nivo Style
      </div>
    </div>
  );

  const VictoryGroupedBarChart = () => (
    <div className="w-full h-80 bg-gray-50 rounded-lg p-4 relative">
      <div className="flex items-end justify-around h-full">
        {salesData.map((dataItem, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="flex" style={{ height: '200px' }}>
              {['Sicherheit', 'Datenschutz', 'Gegenmaßnahmen'].map((key, i) => (
                <div
                  key={key}
                  className={`rounded-sm transition-all duration-500 hover:scale-105 cursor-pointer mx-0.5`}
                  style={{
                    height: `${(dataItem[key] / 250) * 100}%`,
                    width: '18px',
                    backgroundColor: i === 0 ? '#FF6384' : i === 1 ? '#4BC0C0' : '#FFCD56',
                    animationDelay: `${idx * 0.1 + i * 0.05}s`
                  }}
                />
              ))}
            </div>
            <div className="text-xs mt-2 font-semibold text-gray-800 text-center">
              {dataItem.category}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2 text-xs text-pink-500 font-bold">
        Victory Style
      </div>
    </div>
  );

  // Nivo/Victory 스타일 닷 플롯 (시뮬레이션)
  const NivoDotPlot = () => (
    <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 relative">
      <div className="flex flex-col justify-around h-full">
        {dotPlotData.map((d, i) => (
          <div key={i} className="flex items-center relative py-2">
            <div className="w-32 text-right pr-4 text-sm font-medium text-gray-700">
              {d.id}
            </div>
            <div className="flex-grow bg-gray-200 rounded-full h-2 relative">
              <div
                className="absolute h-2 rounded-full bg-blue-500 transition-all duration-1000"
                style={{ width: `${d.value}%` }}
              ></div>
              <div
                className="absolute w-4 h-4 rounded-full bg-blue-700 -translate-y-1/2 top-1/2 shadow-md transition-all duration-1000 animate-bounce-dot"
                style={{ left: `${d.value}%`, transform: `translateX(-50%) translateY(-50%)` }}
              ></div>
            </div>
            <div className="w-12 text-left pl-4 text-sm font-bold text-blue-600">
              {d.value}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2 text-xs text-blue-500 font-bold animate-pulse">
        ✨ Nivo Style
      </div>
    </div>
  );

  const VictoryDotPlot = () => (
    <div className="w-full h-80 bg-gray-50 rounded-lg p-6 relative">
      <div className="flex flex-col justify-around h-full">
        {dotPlotData.map((d, i) => (
          <div key={i} className="flex items-center relative py-2">
            <div className="w-32 text-right pr-4 text-sm font-semibold text-gray-800">
              {d.id}
            </div>
            <div className="flex-grow bg-gray-300 rounded-full h-2 relative">
              <div
                className="absolute w-4 h-4 rounded-full bg-pink-500 -translate-y-1/2 top-1/2 shadow-md"
                style={{ left: `${d.value}%`, transform: `translateX(-50%) translateY(-50%)` }}
              ></div>
              <div className="absolute left-0 top-0 h-2 bg-pink-300 rounded-full" style={{ width: `${d.value}%` }}></div>
            </div>
            <div className="w-12 text-left pl-4 text-sm font-bold text-pink-600">
              {d.value}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-2 right-2 text-xs text-pink-500 font-bold">
        Victory Style
      </div>
    </div>
  );

  // Nivo/Victory 스타일 스파크라인 컴포넌트 전체 삭제됨
  // const NivoSparkline = () => (...)
  // const VictorySparkline = () => (...)

  useEffect(() => {
    if (activeLibrary === 'd3') {
      if (activeChart === 'radar') createD3Radar();
      else if (activeChart === 'bar') createD3Bar();
      else if (activeChart === 'gauge') createD3Gauge();
      else if (activeChart === 'groupedBar') createD3GroupedBar();
      else if (activeChart === 'line') createD3Line();
      else if (activeChart === 'dotplot') createD3DotPlot();
      else if (activeChart === 'sparkline') createD3Sparkline(); // D3 스파크라인은 유지
    }
  }, [activeLibrary, activeChart]);

  const renderChart = () => {
    switch (activeLibrary) {
      case 'recharts':
        switch (activeChart) {
          case 'radar':
            return (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} data={securityData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            );
          case 'bar':
            return (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={securityData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" angle={-45} textAnchor="end" interval={0} height={70} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            );
          case 'gauge':
            return (
              <div className="flex justify-center items-center h-48">
                <div className="relative w-40 h-40">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#82ca9d"
                      strokeWidth="10"
                      strokeDasharray={`${(overallScore / 100) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                      strokeDashoffset={0}
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="55" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold" fill="#333">
                      {overallScore}
                    </text>
                  </svg>
                </div>
              </div>
            );
          case 'groupedBar':
            return (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Sicherheit" fill="#8884d8" />
                  <Bar dataKey="Datenschutz" fill="#82ca9d" />
                  <Bar dataKey="Gegenmaßnahmen" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            );
          case 'line':
            return (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            );
          case 'dotplot':
            return (
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="category" dataKey="id" name="Item" />
                  <YAxis type="number" dataKey="value" name="Value" domain={[0, 100]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="A Scatter" data={dotPlotData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            );
          case 'sparkline':
            return (
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={sparklineData.map((d, i) => ({ index: i, value: d }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            );
          default:
            return null;
        }
      case 'd3':
        switch (activeChart) {
          case 'radar':
            return <svg ref={d3RadarRef}></svg>;
          case 'bar':
            return <svg ref={d3BarRef}></svg>;
          case 'gauge':
            return <svg ref={d3GaugeRef}></svg>;
          case 'groupedBar':
            return <svg ref={d3GroupedBarRef}></svg>;
          case 'line':
            return <svg ref={d3LineRef}></svg>;
          case 'dotplot':
            return <svg ref={d3DotPlotRef}></svg>;
          case 'sparkline':
            return <svg ref={d3SparklineRef}></svg>;
          default:
            return null;
        }
      case 'nivo-custom':
        switch (activeChart) {
          case 'radar':
            return <NivoRadarChart />;
          case 'bar':
            return <NivoBarChart />;
          case 'gauge':
            return <NivoGaugeChart />;
          case 'groupedBar':
            return <NivoGroupedBarChart />;
          case 'line':
            return <NivoLineChart />;
          case 'dotplot':
            return <NivoDotPlot />;
          // case 'sparkline': // Nivo Sparkline 제거
          //   return <NivoSparkline />;
          default:
            return null;
        }
      case 'victory-custom':
        switch (activeChart) {
          case 'radar':
            return <VictoryRadarChart />;
          case 'bar':
            return <VictoryBarChart />;
          case 'gauge':
            return <VictoryGaugeChart />;
          case 'groupedBar':
            return <VictoryGroupedBarChart />;
          case 'line':
            return <VictoryLineChart />;
          case 'dotplot':
            return <VictoryDotPlot />;
          // case 'sparkline': // Victory Sparkline 제거
          //   return <VictorySparkline />;
          default:
            return null;
        }
      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Graphenvergleich je nach Bib
      </h1>

      <div className="mb-8 flex justify-center space-x-4">
        {['recharts', 'd3', 'nivo-custom', 'victory-custom'].map((lib) => (
          <button
            key={lib}
            onClick={() => {
              setActiveLibrary(lib);
              setActiveChart('radar'); // 라이브러리 변경 시 기본 차트로 리셋
            }}
            className={`px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300
              ${activeLibrary === lib
                ? 'bg-blue-600 text-white transform scale-105'
                : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
          >
            {lib === 'recharts' && 'Recharts'}
            {lib === 'd3' && 'D3.js'}
            {lib === 'nivo-custom' && 'Nivo Style'}
            {lib === 'victory-custom' && 'Victory Style'}
          </button>
        ))}
      </div>

      <div className="mb-8 flex justify-center space-x-3 overflow-x-auto pb-2">
        {[
          { id: 'radar', name: 'Radar' },
          { id: 'bar', name: 'Bar' },
          { id: 'gauge', name: 'Gauge' },
          { id: 'groupedBar', name: 'Grupped Bar' },
          { id: 'line', name: 'Line' },
          { id: 'dotplot', name: 'Dotplot' },
          // activeLibrary가 d3 또는 recharts일 때만 스파크라인을 보여주도록 조건부 렌더링
          ...((activeLibrary === 'd3' || activeLibrary === 'recharts') ? [{ id: 'sparkline', name: 'Sparkline' }] : [])
        ].map((chart) => (
          <button
            key={chart.id}
            onClick={() => setActiveChart(chart.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
              ${activeChart === chart.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {chart.name}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-xl min-h-[400px] flex items-center justify-center">
        {renderChart()}
      </div>

      <style jsx>{`
        @keyframes rotate-gauge {
          0% {
            transform: rotate(-90deg);
          }
          100% {
            transform: rotate(${(overallScore / 100) * 360 - 90}deg);
          }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Nivo Line Chart drawing animation */
        .animate-draw-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-line 2s ease-out forwards;
        }

        @keyframes draw-line {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Nivo Sparkline drawing animation (if used elsewhere) */
        .animate-draw-line-light {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw-line-light 1.5s ease-out forwards;
        }

        @keyframes draw-line-light {
            to {
                stroke-dashoffset: 0;
            }
        }

        /* Nivo Dot Plot animation */
        @keyframes bounce-dot {
          0%, 100% { transform: translateX(-50%) translateY(-50%); }
          50% { transform: translateX(-50%) translateY(-60%); }
        }
      `}</style>
    </div>
  );
};

export default LibraryComparisonDemo;
