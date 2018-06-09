import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mongodb";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Writable } from "stream";
import { SalesOrderStatus } from "../models/SalesOrderStatus";
import connect from "../connect";

const collectionName = "SalesOrderStatus";

@odata.type(SalesOrderStatus)
@Edm.EntitySet("SalesOrderStatuses")
export class SalesOrderStatusController extends ODataController {
  @odata.GET
  async find(@odata.query query: ODataQuery): Promise<SalesOrderStatus[]> {
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
  async findOne(@odata.key key: string, @odata.query query: ODataQuery): Promise<SalesOrderStatus> {
    
    const db = await connect();
    const mongodbQuery = createQuery(query);
    let keyId;
    try { keyId = new ObjectID(key); } catch(err) { keyId = key; }
    return db.collection(collectionName).findOne({_id: keyId}, {
      fields: mongodbQuery.projection
    });
  }

  @odata.POST
  async insert(@odata.body data: any): Promise<SalesOrderStatus> {
    const db = await connect();
    data.dateTime = new Date();
    if (typeof data.salesPersonId == "string") data.salesPersonId = new ObjectID(data.salesPersonId);
    data.number = await db.collection('Counter').findOneAndUpdate(
      {"key": collectionName},
      {$inc: {"value": 1}}
    ).then((result) => {
      return result.value.value;
    });

    return await db.collection(collectionName).insertOne(data).then((result) => {
      data._id = result.insertedId;
      return data;
    });
  }

  @odata.PUT
  async upsert(@odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<SalesOrderStatus> {
    const db = await connect();
    if (data._id) delete data._id;
    let keyId;
    try { keyId = new ObjectID(key); } catch(err) { keyId = key; }
    return await db.collection(collectionName).updateOne({_id: keyId}, data, {
      upsert: true
    }).then((result) => {
      data._id = result.upsertedId
      return data._id ? data : null;
    });
  }

  @odata.PATCH
  async update(@odata.key key: string, @odata.body delta: any): Promise<number> {
    const db = await connect();
    if (delta._id) delete delta._id;
    let keyId;
    try { keyId = new ObjectID(key); } catch(err) { keyId = key; }
    if (typeof delta.salesPersonId == "string") delta.salesPersonId = new ObjectID(delta.salesPersonId);
    return await db.collection(collectionName).updateOne({_id: keyId}, {$set: delta}).then(result => result.modifiedCount);
  }

  @odata.DELETE
  async remove(@odata.key key: string): Promise<number> {
    const db = await connect();
    let keyId;
    try { keyId = new ObjectID(key); } catch(err) { keyId = key; }
    return await db.collection(collectionName).deleteOne({_id: keyId}).then(result => result.deletedCount);
  }
}