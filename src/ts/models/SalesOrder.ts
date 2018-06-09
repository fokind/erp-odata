import {ObjectID} from "mongodb";
import {Edm, odata} from "odata-v4-server";
import {Employee} from "../models/Employee";

@Edm.Annotate({
  term: "UI.DisplayName",
  string: "SalesOrders"
})
export class SalesOrder {
  constructor (jsonData: any) {
    Object.assign(this, jsonData);
  }

  @Edm.Key
  @Edm.Computed
  @Edm.String
  _id: ObjectID

  @Edm.String
  name: string

  @Edm.Double
  number: number

  @Edm.Date
  dateTime: Date

  @Edm.String
  customerName: string

  @Edm.String
  invoicingAddress: string

  @Edm.String
  deliveryAddress: string

  @Edm.String
  salesPersonName: string

  @Edm.String
  salesPersonId: ObjectID

  @Edm.ForeignKey("salesPersonId")
  @Edm.EntityType(Edm.ForwardRef(() => Employee))
  salesPerson: Employee

  @Edm.String
  statusName: string

  @Edm.String
  statusKey: string

  @Edm.Double
  untaxedAmount: number

  @Edm.Double
  taxes: number

  @Edm.Double
  total: number

  @Edm.Collection(Edm.String)
  @Edm.Function
  echo() {
    return ["echotest"];
  }
}
