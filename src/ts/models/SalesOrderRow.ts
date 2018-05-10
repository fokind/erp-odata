import {ObjectID} from "mongodb";
import {Edm, odata} from "odata-v4-server";
import {SalesOrder} from "./SalesOrder";

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
  _id: ObjectID

  @Edm.Computed
  @Edm.String
  salesOrderId: ObjectID

  @Edm.String
  productName: string

  @Edm.Double
  quantity: number

  @Edm.Double
  unitPrice: number

  @Edm.Double
  taxes: number

  @Edm.Double
  discountPercent: number

  @Edm.Double
  subtotal: number
}
