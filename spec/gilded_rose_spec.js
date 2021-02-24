var { Shop, Item } = require('../src/gilded_rose.js');
describe("GildedRose shop manager", function () {
  var listItems;

  beforeEach(function () {
    listItems = [];
  });


  it("Baisser de 1 la qualité et sellIn d'item normaux", function () {
    listItems.push(new Item("+5 Dexterity Vest", 10, 20));
    listItems.push(new Item("Mana Cake", 3, 6));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 9, quality: 19 },
      { sellIn: 2, quality: 5 }
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Augmenter la qualité de 1 pour Aged Brie et Backstage passes", function () {
    listItems.push(new Item("Aged Brie", 20, 30));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 20, 30));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 19, quality: 31 },
      { sellIn: 19, quality: 31 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Augmenter la qualité de 3 pour Backstage passes qaund il reste 5 jours ou moins", function () {
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 4, 30));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 5, 10));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 3, quality: 33 },
      { sellIn: 4, quality: 13 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Augmenter la qualité de 2 pour Backstage passes qaund il reste entre 10 jours et 5 jours", function () {
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 7, 30));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 10, 40));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 6, quality: 32 },
      { sellIn: 9, quality: 42 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Sulfuras ne se modifie jamais", function () {
    listItems.push(new Item("Sulfuras, Hand of Ragnaros", 4, 80));
    listItems.push(new Item("Sulfuras, Hand of Ragnaros", 4, 80));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 4, quality: 80 },
      { sellIn: 4, quality: 80 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("Si l'élément est Conjured il se dégrade 2 fois plus vite", function () {
    listItems.push(new Item("Conjured Magic Stick", 4, 30));
    listItems.push(new Item("Conjured Dark Blade", 10, 20));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 3, quality: 28 },
      { sellIn: 9, quality: 18 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("La qualité d'un produit n'est jamais de plus de 50", function () {
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 20, 50));
    listItems.push(new Item("Aged Brie", 10, 50));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 3, 49));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 19, quality: 50 },
      { sellIn: 9, quality: 50 },
      { sellIn: 2, quality: 50 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("La qualité ne peut jamais être négative", function () {
    listItems.push(new Item("Conjured Magic Stick", 13, 1));
    listItems.push(new Item("El Baton", 13, 0));
    listItems.push(new Item("Rabadon", 0, 1));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: 12, quality: 0 },
      { sellIn: 12, quality: 0 },
      { sellIn: -1, quality: 0 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("La date de peremption passé, la qualité ce dégrade deux fois plus rapidement", function () {
    listItems.push(new Item("Conjured Magic Stick", 0, 10));
    listItems.push(new Item("El Baton", -2, 10));
    listItems.push(new Item("Rabadon", 0, 3));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: -1, quality: 6 },
      { sellIn: -3, quality: 8 },
      { sellIn: -1, quality: 1 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });

  it("La qualité Backstage passes à 0 après le concert", function () {
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 0, 50));
    listItems.push(new Item("Backstage passes to a TAFKAL80ETC concert", 0, 30));

    const gildedRose = new Shop(listItems);
    const items = gildedRose.updateQuality();

    var expected = [
      { sellIn: -1, quality: 0 },
      { sellIn: -1, quality: 0 },
    ];
    expected.forEach(function (testCase, idx) {
      expect(items[idx].quality).toBe(testCase.quality);
      expect(items[idx].sellIn).toBe(testCase.sellIn);
    });
  });
  
});