import Xray from 'x-ray';
import moment from 'moment';
import {dietFlags} from './config.js'


const htmlScraper = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.trim().replace(/\s\*$/,'') : value
    },
    normalizeSpecialDiets: function (value) {
      if (value === 'Vgn') return 'VGN';
      if (value === 'Vg') return 'VEG';
      return value;
    },
    trimPrice: function (value) {
      if (value === '') return value;
        return typeof value === 'string' ? value.trim().replace(/\s€$/,'') : value
    }
  }
});

export function scrape(urlSubPath){

  return new Promise((resolve, reject) => {
    const id = urlSubPath;
    let now = moment()
    const year = now.year();
    let week = now.isoWeek();
    if (now.isoWeekday() == 7) { //fetch the next week if Sunday
      week += 1;
      now = now.add(1,'day');
    }
    let weekStartDate = now.isoWeekday("Monday");

    const url  = `http://www.studentlunch.fi/en/lunch-list/weeks-list?id=${id}&year=${year}&week=${week}`;
    // console.log(url);

    htmlScraper(url, 'table.week-list', [{
      menuList: htmlScraper('tr', [{
        title: 'td.food | trim',
        'special-diets':   htmlScraper(['td.food-allergies span.food-diet | normalizeSpecialDiets']),
        'price-student': 'td.price-research | trimPrice',
        'price-staff': 'td.price-staff | trimPrice',
        'price-visitor': 'td.price-visitor | trimPrice'
      }])
    }])( (err, menus) => {
      if (err){
        reject(err);
      }
      else{
        menus.forEach( (menu,index) => {
          menu['date'] = weekStartDate.clone().add(index, 'day').format('YYYY-MM-DD');
          menu['menuList'].forEach((item,index) => {
            item['price'] = [item['price-student'], item['price-staff'], item['price-visitor']];
            if(item['price-student']) delete item['price-student'];
            if(item['price-staff']) delete item['price-staff'];
            if(item['price-visitor']) delete item['price-visitor'];
            item['special-diets'] = item['special-diets'].filter((item,index) =>{
              return dietFlags.indexOf(item) != -1;
            })
          });
        });
        resolve(menus);
      }
    });
  });
}

// scrape('1').then(console.log).catch(console.log);
