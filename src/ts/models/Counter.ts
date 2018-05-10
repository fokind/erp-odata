import {ObjectID} from "mongodb";
import {Edm, odata} from "odata-v4-server";

export class Counter {
  constructor(jsonData: any) {
    Object.assign(this, jsonData);
  }

  @Edm.Key
  @Edm.Computed
  @Edm.String
  _id: ObjectID

  @Edm.Key
  @Edm.String
  key: string

  @Edm.Double
  value: number
}
