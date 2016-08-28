import Xray from 'x-ray';
import moment from 'moment';


const htmlScraper = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.trim().replace(/[\n\t]/g,'') : value
    },
    reverse: function (value) {
      return typeof value === 'string' ? value.split('').reverse().join('') : value
    },
    extractSpecialDiets: function (value) {
      if (value === '') return value;
      return typeof value === 'string' ? Array.from(new Set(value.match(/\w+/g))) : value
    },
    extractPriceArray: function (value) {
      if (value === '') return value;
        return typeof value === 'string' ? value.match(/\d+.\d{2}/g) : value
    }
  }
});

export function scrape(urlSubPath){

  const url = `http://www.unica.fi/en/restaurants/${urlSubPath}`;
  //console.log(url);

  return new Promise((resolve, reject) => {
    htmlScraper('http://www.unica.fi/en','span.small')( (err, date) => {
      if (err){
        reject(err);
      }
      else{
        let weekStartDate = moment(date,'DD.MM.YYYY').day("Monday");

        htmlScraper(url,'div.accord',[{
          weekday:'h4',
          //date: '',
          menuList: htmlScraper('tr',[{
            title: 'td.lunch | trim',
            'special-diets': 'td.limitations | extractSpecialDiets',
            price: 'td.price | extractPriceArray'
          }])
        }])( (err,menus) => {
          if (err){
            reject(err);
          }
          else{
            menus.forEach( (menu,index) => {
              menu['date'] = weekStartDate.clone().add(index, 'day').format('YYYY-MM-DD');
            });
            resolve(menus);
          }
        });
      }
    });
  });
}
