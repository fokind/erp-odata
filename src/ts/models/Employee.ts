import {ObjectID} from "mongodb";
import {Edm, odata} from "odata-v4-server";

@Edm.Annotate({
  term: "UI.DisplayName",
  string: "Employees"
})
export class Employee {
  constructor (jsonData: any) {
      Object.assign(this, jsonData);
  }

  @Edm.Key
  @Edm.Computed
  @Edm.String
  _id: ObjectID

  @Edm.Double
  number: number

  @Edm.String
  firstName: string

  @Edm.String
  lastName: string

  @Edm.Boolean
  isSalesPerson: boolean
}
