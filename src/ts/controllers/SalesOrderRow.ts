import {Collection, ObjectID} from "mongodb";
import {createQuery} from "odata-v4-mongodb";
import {ODataController, Edm, odata, ODataQuery} from "odata-v4-server";
import {SalesOrderRow} from "../models/SalesOrderRow";
import connect from "../connect";

const collectionName = "SalesOrderRow";

@odata.type(SalesOrderRow)
@Edm.EntitySet("SalesOrderRows")
export class SalesOrderRowController extends ODataController {
  @odata.GET
  async find(@odata.query query: ODataQuery): Promise<SalesOrderRow[]> {
    //console.log(query);
    const db = await connect();
    const mongodbQuery = createQuery(query);
    if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
    if (typeof mongodbQuery.query.parentId == "string") mongodbQuery.query.parentId = new ObjectID(mongodbQuery.query.parentId);
    
    let result = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : await db.collection(collectionName)
      .find(mongodbQuery.query)
      .project(mongodbQuery.projection)
      .skip(mongodbQuery.skip || 0)
      .limit(mongodbQuery.limit || 0)
      .sort(mongodbQuery.sort)
      .toArray();
    if (mongodbQuery.inlinecount) {
      (<any>result).inlinecount = await db.collection(collectionName)
        .find(mongodbQuery.query)
        .project(mongodbQuery.projection)
        .count(false);
    }
    return result;
  }

  @odata.GET
  async findOne(@odata.key key: string, @odata.query query: ODataQuery): Promise<SalesOrderRow> {
    const db = await connect();
    const mongodbQuery = createQuery(query);
    let keyId;
    try { keyId = new ObjectID(key); } catch(err) { keyId = key; }
    return db.collection(collectionName).findOne({_id: keyId}, {
      fields: mongodbQuery.projection
    });
  }

  @odata.POST
  async insert(@odata.body data: any): Promise<SalesOrderRow> {
    //console.log(data);
    const db = await connect();
    if (typeof data.salesOrderId == "string") data.salesOrderId = new ObjectID(data.salesOrderId);
    return await db.collection(collectionName).insertOne(data).then((result) => {
      data._id = result.insertedId;
      //получить и сразу записать очередной номер по счетчику
      //присвоить
      return data;
    });
  }

  @odata.PUT
  async upsert(@odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<SalesOrderRow> {
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
    //await db.collection('SalerOrder')

    /*db.collection('SalerOrder').aggregate([
      {
        $match: {
          _id: 
        }
      },
      {
        $group: {
          _id: null,
          total : {
            $sum: "$total"
          }
        }
      }
    ], function(err, result) {
      if (err) return console.dir(err)
      console.log(result);
    });*/

    //пример вычисления зависимого поля
    await db.collection(collectionName).findOne({_id: keyId}).then(result => {
      if (!delta.quantity) delta.quantity = result.quantity;
      if (!delta.price) delta.price = result.price;
      delta.total = delta.quantity * delta.price;
    });

    return await db.collection(collectionName).updateOne({_id: keyId}, {$set: delta})
      .then(result => {
        return result.modifiedCount;
      });//BUG modifiedCount не существует, вместо этого nModified
  }

  @odata.DELETE
  async remove( @odata.key key: string): Promise<number> {
    const db = await connect();
    let keyId;
    try { keyId = new ObjectID(key); } catch(err) { keyId = key; }
    return await db.collection(collectionName).deleteOne({_id: keyId}).then(result => result.deletedCount);
  }
}
