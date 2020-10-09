import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
  async disconnect(): Promise<void> {
    await this.client.close();
  },
  getColletion(name: string): Collection {
    return this.client.db().collection(name);
  },

  map: (collection: any):any => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id, ...accountWithoutId } = collection;
    return { ...accountWithoutId, id: _id };
  },

};
