class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  constructor(items=[]){
    this.items = items;
    this.maxQuality = 50;
  }

  isLegendary(name) {
    return name === 'Sulfuras, Hand of Ragnaros';
  }

  isBackstage(name) {
    return name === 'Backstage passes to a TAFKAL80ETC concert';
  }

  isConjured(name) {
    return name.indexOf("Conjured") === 0;
  }

  addQuality(item, number) {
    if (item.quality < this.maxQuality) {
      item.quality += number;
    }
  }
  
  removeQuality(item, number) {
    if (item.quality - number > 0) {
      if (item.name !== 'Sulfuras, Hand of Ragnaros') {
        item.quality -= number;
      }
    } else item.quality = 0;
  }

  updateBackstage(item) {
    this.addQuality(item, 1);
    if (item.sellIn < 11) this.addQuality(item, 1);
    if (item.sellIn < 6) this.addQuality(item, 1);
  }

  updateQuality() {
    this.items.map((item) => {
      if (item.name === 'Aged Brie') this.addQuality(item, 1);
      else if (this.isConjured(item.name)) this.removeQuality(item, 2);
      else if (this.isBackstage(item.name)) this.updateBackstage(item); 
      else this.removeQuality(item, 1);
      
      if (!this.isLegendary(item.name)) {
        item.sellIn -= 1;
      }

      if (item.sellIn < 0) {
        if (item.name === 'Aged Brie') this.addQuality(item, 1);
        else if (this.isBackstage(item.name)) item.quality = 0;
        else if (this.isConjured(item.name)) this.removeQuality(item, 2);
        else this.removeQuality(item, 1);
      }
    })

    return this.items;
  }
}
module.exports = {
  Item,
  Shop
}
