import { Collection, ObjectID } from "mongodb";
import { createQuery } from "odata-v4-mongodb";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { Employee } from "../models/Employee";
import connect from "../connect";

const collectionName = "Employee";

@odata.type(Employee)
@Edm.EntitySet("Employees")
export class EmployeeController extends ODataController {
    @odata.GET
    async find( @odata.query query: ODataQuery): Promise<Employee[]> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        if (typeof mongodbQuery.query._id == "string") mongodbQuery.query._id = new ObjectID(mongodbQuery.query._id);
        let result = typeof mongodbQuery.limit == "number" && mongodbQuery.limit === 0 ? [] : await db.collection(collectionName)
                .find(mongodbQuery.query)
                .project(mongodbQuery.projection)
                .skip(mongodbQuery.skip || 0)
                .limit(mongodbQuery.limit || 0)
                .sort(mongodbQuery.sort)
                .toArray();
        if (mongodbQuery.inlinecount){
            (<any>result).inlinecount = await db.collection(collectionName)
                    .find(mongodbQuery.query)
                    .project(mongodbQuery.projection)
                    .count(false);
        }
        return result;
    }

    @odata.GET
    async findOne( @odata.key key: string, @odata.query query: ODataQuery): Promise<Employee> {
        const db = await connect();
        const mongodbQuery = createQuery(query);
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return db.collection(collectionName).findOne({ _id: keyId }, {
            fields: mongodbQuery.projection
        });
    }

    @odata.POST
    async insert( @odata.body data: any): Promise<Employee> {
        const db = await connect();
        //try{ if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId); }catch(err){}
        return await db.collection(collectionName).insertOne(data).then((result) => {
            data._id = result.insertedId;
            return data;
        });
    }

    @odata.PUT
    async upsert( @odata.key key: string, @odata.body data: any, @odata.context context: any): Promise<Employee> {
        const db = await connect();
        //try{ if (data.CategoryId) data.CategoryId = new ObjectID(data.CategoryId); }catch(err){}
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
        //try{ if (delta.CategoryId) delta.CategoryId = new ObjectID(delta.CategoryId); }catch(err){}
        if (delta._id) delete delta._id;
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection(collectionName).updateOne({ _id: keyId }, { $set: delta }).then(result => result.modifiedCount);
    }

    @odata.DELETE
    async remove( @odata.key key: string): Promise<number> {
        const db = await connect();
        let keyId;
        try{ keyId = new ObjectID(key); }catch(err){ keyId = key; }
        return await db.collection(collectionName).deleteOne({ _id: keyId }).then(result => result.deletedCount);
    }
}
