import * as d3 from 'd3';
import Chart from './chart';
import '../index.css';

document.addEventListener('DOMContentLoaded', () => {
   let formattedData, chart;

   d3.json('../data/data.json')
      .then(data => {
         formattedData = data.map(yearData => ({
            year: yearData.year,
            countries: yearData.countries.filter(country => country.life_exp && country.income)
         }));

         chart = new Chart('#chart');
      })

});