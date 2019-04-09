import * as d3 from 'd3';
import Chart from './chart';
import '../index.css';

let formattedData, firstYear, chart, interval, count = 0;
const switchBtn = document.getElementById('switch'),
      resetBtn = document.getElementById('reset'),
      range = document.getElementById('range'),
      year = document.getElementById('year');


d3.json('../data/data.json')
   .then(data => {
      formattedData = data.map(yearData => ({
         year: yearData.year,
         countries: yearData.countries.filter(country => country.life_exp && country.income)
      }));
      firstYear = +formattedData[0].year;
      range.setAttribute('min', firstYear);
      range.setAttribute('max', formattedData[formattedData.length - 1].year);
      range.setAttribute('value', firstYear);
      year.textContent = firstYear;
      chart = new Chart('#chart');
   });


switchBtn.addEventListener('click', function() {
   if (this.textContent === 'Play') {
      this.textContent = 'Pause';
      interval = setInterval(step, 200);
   } else {
      this.textContent = 'Play';
      clearInterval(interval);
   }
});

resetBtn.addEventListener('click', function() {
   count = 0;
   update();
});

range.addEventListener('input', function() {
   count = this.value - firstYear;
   update();
});


function step() {
   count = count < formattedData.length - 1 ? ++count : 0;
   update();
}

function update() {
   range.value = firstYear + count;
   year.textContent = firstYear + count;
   chart.wrangleData();
}

export const getData = () => formattedData[count];