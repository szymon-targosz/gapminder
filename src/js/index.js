import * as d3 from 'd3';
import Chart from './chart';
import BarChart from './bar-chart';
import '../index.css';

let formattedData, firstYear, chart, barIncome, barLife, barPopulation, interval, count = 0;
const switchBtn = document.getElementById('switch'),
   resetBtn = document.getElementById('reset'),
   range = document.getElementById('range'),
   select = document.getElementById('region'),
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
      chart = new Chart('#main-chart');
      barIncome = new BarChart('#income', 'income', 'Average GDP per capita');
      barLife = new BarChart('#life-exp', 'life_exp', 'Average life expectancy');
      barPopulation = new BarChart('#population', 'population', 'Population');
   });


switchBtn.addEventListener('click', function () {
   if (this.textContent === 'Play') {
      this.textContent = 'Pause';
      interval = setInterval(step, 200);
   } else {
      this.textContent = 'Play';
      clearInterval(interval);
   }
});

resetBtn.addEventListener('click', function () {
   count = 0;
   update();
});

range.addEventListener('input', function () {
   count = this.value - firstYear;
   update();
});

select.addEventListener('change', update);

function step() {
   count = count < formattedData.length - 1 ? ++count : 0;
   update();
}

function update() {
   range.value = firstYear + count;
   year.textContent = firstYear + count;
   chart.wrangleData();
   barIncome.wrangleData();
   barLife.wrangleData();
   barPopulation.wrangleData();
}

export const getData = () => ({ data: formattedData[count], region: select.value });