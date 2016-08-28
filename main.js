import * as apiDriver from './util/api-driver.js';
import Restaurant from './util/restaurantClass.js';
import {waitForAll} from './util/util.js'

async function main() {
  try {

    let restaurants = await apiDriver.fetchRestaurants();
    restaurants = restaurants.map(item => new Restaurant(item));

    let tasks = [];
    for (let i = 0; i < restaurants.length; i++) {
      tasks.push(
        restaurants[i].scrapeMenu()
        .then(menu => {
        return restaurants[i].saveMenu(menu)
        })
      );
    }

    waitForAll(tasks).then( successfulNum => {
      console.log(`Pushed ${successfulNum}/${tasks.length} menus to database.`);
    }).catch(function(e){
      console.log(e);
    });

  } catch (e) {
    console.log(e);
  }
}

// Start the scraper
main();
