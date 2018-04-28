import { ObjectID } from "mongodb";
import { Edm, odata } from "odata-v4-server";
import { SalesOrder } from "./SalesOrder";

@Edm.Annotate({
  term: "UI.DisplayName",
  string: "SalesOrderRows"
})
export class SalesOrderRow{
  constructor (jsonData: any) {
    Object.assign(this, jsonData);
  }

  @Edm.Key
  @Edm.Computed
  @Edm.String
  _id:ObjectID

  //@Edm.TypeDefinition(ObjectID)
  //@Edm.Required
  @Edm.Computed
  @Edm.String
  parentId:ObjectID

  @Edm.String
  name:string

  @Edm.Boolean
  deleted:boolean

  @Edm.Double
  quantity:number

  @Edm.Double
  price:number
  
  @Edm.Double
  total:number
}
