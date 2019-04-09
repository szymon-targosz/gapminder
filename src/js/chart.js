import * as d3 from 'd3';
import { getData } from './index';

export default class Chart {
   constructor(parentElem) {
      this.parentElem = parentElem;

      this.initVis();
   }

   initVis() {
      this.margin = { left: 80, right: 30, top: 50, bottom: 80 };
      this.height = 500 - this.margin.bottom - this.margin.top;
      this.width = 800 - this.margin.right - this.margin.left;
      this.continents = ['asia', 'africa', 'europe', 'americas'];
      this.t = () => d3.transition().duration(200).ease(d3.easeExpIn)

      this.svg = d3.select(this.parentElem).append('svg')
                     .attr('width', this.width + this.margin.left + this.margin.right)
                     .attr('height', this.height + this.margin.bottom + this.margin.top);

      this.g = this.svg.append('g')
                     .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

      this.x = d3.scaleLog()
                  .base(10)
                  .domain([142, 150000])
                  .range([0, this.width]);

      this.y = d3.scaleLinear()
                  .domain([0, 95])
                  .range([this.height, 0]);
   
      this.r = d3.scaleLinear()
                  .domain([2000, 1400000000])
                  .range([25 * Math.PI, 1500 * Math.PI]);

      this.c = d3.scaleOrdinal()
                  .domain(this.continents)
                  .range(['tomato', 'gold', 'royalblue', 'forestgreen']);

      this.xAxisCall = d3.axisBottom(this.x)
                           .tickValues([400, 4000, 40000])
                           .tickFormat(d => `$${d}`);

      this.yAxisCall = d3.axisLeft(this.y);

      this.g.append('g')
         .attr('class', 'x axis')
         .attr('transform', `translate(0, ${this.height})`)
         .call(this.xAxisCall);

      this.g.append('g')
         .attr('class', 'y axis')
         .call(this.yAxisCall);

      this.xLabel = this.g.append('text')
                        .attr('x', this.width / 2)
                        .attr('y', this.height + 40)
                        .attr('font-size', '1.4rem')
                        .attr('text-anchor', 'middle')
                        .text('Income (USD)');

      this.yLabel = this.g.append('text')
                        .attr('x', -this.height / 2)
                        .attr('y', -40)
                        .attr('transform', 'rotate(-90)')
                        .attr('font-size', '1.4rem')
                        .attr('text-anchor', 'middle')
                        .text('Life Expectancy (years)');

      this.yearLabel = this.g.append('text')
                        .attr('x', this.width)
                        .attr('y', this.height - 10)
                        .attr('font-size', '4rem')
                        .attr('fill', '#ccc')
                        .attr('text-anchor', 'end')
                        .text('1800');
      
      this.wrangleData()
      this.addLegend()
   }

   addLegend() {
      const legend = this.g.append('g').attr('transform', `translate(${this.width - 80}, ${this.height - 125})`);

      const legendRow = legend.selectAll('.legend-row')
                              .data(this.continents)
                              .enter()
                              .append('g')
                                 .attr('class', 'legend-row')
                                 .attr('transform', (d, i) => `translate(0, ${i * 20})`);
      
      legendRow.append('rect')
               .attr('height', 10)
               .attr('width', 10)
               .attr('fill', d => this.c(this.c(d)));

      legendRow.append('text')
               .attr('x', 15)
               .attr('y', 10)
               .text(d => d.charAt(0).toUpperCase() + d.slice(1));
   }

   wrangleData() {
      this.data = getData();
      
      this.updateVis();
   }

   updateVis() {
      const circles = this.g.selectAll('circle')
                           .data(this.data.countries, d => d.country);

      circles
         .exit()
         .transition(this.t())
            .attr('r', 0)
            .remove();

      circles
         .enter()
         .append('circle')
            .attr('fill', d => this.c(d.continent))
            .attr('stroke', d => this.c(d.continent))
            .attr('stroke-width', 1)
            .on('mouseover', () => d3.event.target.style.stroke = 'black')
            .on('mouseout', (d) => d3.event.target.style.stroke = this.c(d.continent))
         .merge(circles)
            .transition(this.t())
            .attr('r', d => Math.sqrt(this.r(d.population) / Math.PI))
            .attr('cx', d => this.x(d.income))
            .attr('cy', d => this.y(d.life_exp));
   
      this.yearLabel.text(this.data.year);
   }
}
