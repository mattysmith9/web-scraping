'use strict';

import { MongoClient } from 'mongodb';

class ApartmentStore {
  constructor(dbUrl) {
    this.dbUrl = dbUrl;
    this.dbClient = null;
    this.dbNameArray = dbUrl.split('/');
    this.dbName = this.dbNameArray[this.dbNameArray.length - 1];
    this.collectionName = 'apartments';
  }

  async client() {
    if (this.dbClient && this.dbClient.isConnected()) {
      return this.dbClient;
    } else {
      console.log(`Connecting to ${this.dbUrl}...`);
      this.dbClient = await MongoClient.connect(this.dbUrl, {
        useNewUrlParser: true
      });
      console.log('Connected to the apartment database!');
      return this.dbClient;
    }
  }

  async collection() {
    const client = await this.client();
    const db = client.db(this.dbName);
    const collection = db.collection(this.collectionName);
    return collection;
  }

  async all() {
    let collection = await this.collection();
    return collection.find({}).sort([['when', 1]]);
  }

  async deleteAll() {
    (await this.collection()).drop();
  }

  async add(apartment) {
    let collection = await this.collection();
    collection.insertOne(apartment);
  }
}

export default ApartmentStore;
