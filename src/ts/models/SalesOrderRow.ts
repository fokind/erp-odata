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
  @Edm.Annotate({
    term: "UI.DisplayName",
    string: "ID"
  }, {
    term: "UI.ControlHint",
    string: "ReadOnly"
  })
  _id:ObjectID

  @Edm.TypeDefinition(ObjectID)
  @Edm.Required
  parentId:ObjectID

  @Edm.String
  @Edm.Annotate({
    term: "UI.DisplayName",
    string: "Description"
  }, {
    term: "UI.ControlHint",
    string: "ShortText"
  })
  name:string

  @Edm.Boolean
  @Edm.Annotate({
    term: "UI.DisplayName",
    string: "Editing"
  }, {
    term: "UI.ControlHint",
    string: "Boolean"
  })
  edit:boolean

  @Edm.Boolean
  @Edm.Annotate({
    term: "UI.DisplayName",
    string: "Deleted"
  }, {
    term: "UI.ControlHint",
    string: "Boolean"
  })
  deleted:boolean

  @Edm.Double
  @Edm.Annotate({
    term: "UI.DisplayName",
    string: "Total"
  }, {
    term: "UI.ControlHint",
    string: "Number"
  })
  total:number
}
