import { MongoClient, Db } from "mongodb";

export default async function():Promise<Db>{
    const uri = process.env.NODE_ENV === "production" ?
    "mongodb://readWrite:readWrite@localhost:27017/odata" :
    "mongodb://readWrite:readWrite@localhost:27017/odata";
    
    return (await MongoClient.connect(uri)).db('odata');
};