import * as d3 from 'd3';
import { getData } from './index';

export default class BarChart {
   constructor(parentElem, field, title) {
      this.parentElem = parentElem;
      this.field = field;
      this.title = title;

      this.initVis();
   }

   initVis() {
      this.margin = { left: 40, right: 40, top: 40, bottom: 50 };
      this.height = 200 - this.margin.top - this.margin.bottom;
      this.width = 270 - this.margin.left - this.margin.right;
      this.continents = ['asia', 'africa', 'europe', 'americas'];
      this.t = () => d3.transition().duration(150);

      this.svg = d3.select(this.parentElem).append('svg')
                     .attr('width', this.width + this.margin.left + this.margin.right)
                     .attr('height', this.height + this.margin.bottom + this.margin.top);

      this.g = this.svg.append('g')
                     .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

      this.c = d3.scaleOrdinal()
                  .domain(this.continents)
                  .range(['tomato', 'gold', 'royalblue', 'forestgreen']);

      this.x = d3.scaleBand()
                  .domain(this.continents)
                  .range([0, this.width])
                  .padding(.2);

      this.y = d3.scaleLinear()
                  .range([this.height, 0]);

      this.xAxisCall = d3.axisBottom()
                           .tickFormat(d => d.charAt(0).toUpperCase() + d.slice(1));
      
      this.yAxisCall = d3.axisLeft()
                           .ticks(4);
      
      this.xAxis = this.g.append('g')
                     .attr('class', 'x axis')
                     .attr('transform', `translate(0, ${this.height})`);

      this.yAxis = this.g.append('g')
                        .attr('class', 'y axis');

      this.title = this.g.append('text')
                        .attr('x', this.width / 2)
                        .attr('y', -20)
                        .attr('text-anchor', 'middle')
                        .text(this.title);

      this.wrangleData();
   }

   wrangleData() {
      this.data = d3.nest()
                     .key(d => d.continent)
                     .entries(getData().data.countries)
                     .map(d => {
                        if (this.field === 'population') return {
                           region: d.key,
                           val: d3.sum(d.values, d => d[this.field])
                        };

                        return { 
                           region: d.key,
                           val: d3.sum(d.values, d => d[this.field]) / d.values.length 
                        };                   
                     });

      this.updateVis();
   }

   updateVis() {
      if (this.field === 'life_exp') {
         this.y.domain([0, 100]);
      } else {
         this.y.domain([0, d3.max(this.data, d => d.val)]);
         this.yAxisCall.tickFormat(d3.format('.2s'));
      }  

      this.xAxisCall.scale(this.x);
      this.yAxisCall.scale(this.y);
      this.yAxis.transition(this.t()).call(this.yAxisCall);
      this.xAxis.transition(this.t())
                  .call(this.xAxisCall)
                  .selectAll("text")
                  .attr("y", 5)
                  .attr("x", -8)
                  .attr("transform", "rotate(-40)")
                  .style("text-anchor", "end");

      this.rects = this.g.selectAll('rect')
                        .data(this.data, d => d.region); 

      this.rects.enter()
         .append('rect')
            .attr('fill', d => this.c(d.region))
         .merge(this.rects)
            .transition(this.t())
            .attr('x', d => this.x(d.region))
            .attr('y', d => this.y(d.val))
            .attr('width', this.x.bandwidth)
            .attr('height', d => this.height - this.y(d.val));
   }
}