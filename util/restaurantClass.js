import * as chainScrapers from '../scraper/restaurant-chains';
import * as apiDriver from './api-driver.js';

export default class Restaurant {
  constructor(data) {
    this.url = data.url;
    this.chain = data.chain;
    this.restaurantID = data['_id'];
  }

  scrapeMenu() {

    let scraper = chainScrapers[this.chain];
    if (scraper) {
      return scraper.scrape(this.url);
    }
    else {
      //throw "Error! no scraper is available";
      return Promise.reject(`No scraper is available for ${this.chain}.`); //more consistency in error handling
    }
  }

  saveMenu(menu) {
    return apiDriver.saveMenu(this.restaurantID, menu);
  }
}
