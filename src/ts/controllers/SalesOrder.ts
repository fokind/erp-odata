import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mongodb";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Writable } from "stream";
import { SalesOrder } from "../models/SalesOrder";
import { SalesOrderRow } from "../models/SalesOrderRow";
import connect from "../connect";

const collectionName = "SalesOrder";

@odata.type(SalesOrder)
@Edm.EntitySet("SalesOrders")
export class SalesOrderController extends ODataController {
  @odata.GET
  async find( @odata.query query: ODataQuery): Promise<SalesOrder[]> {
    
    const db = await connect();
    const mongodbQuery = createQuery(query);
    if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
    let result = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : await db.collection(collectionName)
      .find(mongodbQuery.query)
      .project(mongodbQuery.projection)
      .skip(mongodbQuery.skip || 0)
      .limit(mongodbQuery.limit || 0)
      .sort(mongodbQuery.sort)
      .toArray();//TODO заменить на поток
    if (mongodbQuery.inlinecount) {
      (<any>result).inlinecount = await db.collection(collectionName)
        .find(mongodbQuery.query)
        .project(mongodbQuery.projection)
        .count(false);
    }
    return result;
  }

  @odata.GET
  async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<SalesOrder> {
    
    const db = await connect();
    const mongodbQuery = createQuery(query);
    let keyId;
    try { keyId = new ObjectID(key); }catch(err){ keyId = key; }
    return db.collection(collectionName).findOne({ _id: keyId }, {
      fields: mongodbQuery.projection
    });
  }

  @odata.POST
  async insert( @odata.body data: any): Promise<SalesOrder> {
    //console.log(data);
    const db = await connect();
    return await db.collection(collectionName).insertOne(data).then((result) => {
      data._id = result.insertedId;
      return data;
    });
  }

  @odata.PUT
  async upsert( @odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<SalesOrder> {
    const db = await connect();
    if (data._id) delete data._id;
    let keyId;
    try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
    return await db.collection(collectionName).updateOne({ _id: keyId }, data, {
      upsert: true
    }).then((result) => {
      data._id = result.upsertedId
      return data._id ? data : null;
    });
  }

  @odata.PATCH
  async update( @odata.key key: string, @odata.body delta: any): Promise<number> {
    const db = await connect();
    if (delta._id) delete delta._id;
    let keyId;
    try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
    return await db.collection(collectionName).updateOne({ _id: keyId }, { $set: delta }).then(result => result.modifiedCount);
  }

  @odata.DELETE
  async remove( @odata.key key: string): Promise<number> {
    //console.log('DELETE');
    const db = await connect();
    let keyId;
    try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
    return await db.collection(collectionName).deleteOne({ _id: keyId }).then(result => result.deletedCount);
  }

  @odata.GET("Rows")
  async getRows(@odata.result result: SalesOrder, @odata.query query: ODataQuery, @odata.stream stream: Writable) {
    let mongodbQuery = createQuery(query);
    mongodbQuery.query = {$and: [mongodbQuery.query, {parentId: new ObjectID(result._id)}]};
    const db = await connect();
    return await db.collection("SalesOrderRow")
      .find(mongodbQuery.query, mongodbQuery.projection, mongodbQuery.skip, mongodbQuery.limit)
      .stream().pipe(stream);
  }

  @odata.DELETE("Rows")
  async removeRows( @odata.key key: string): Promise<number> {
    //console.log('DELETE Rows');
    const db = await connect();
    let keyId;
    try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
    return await db.collection("SalesOrderRow").deleteOne({ _id: keyId }).then(result => result.deletedCount);
  }
}
