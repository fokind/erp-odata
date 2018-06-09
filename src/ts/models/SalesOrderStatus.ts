import { ObjectID } from 'mongodb';
import { Edm, odata } from 'odata-v4-server';
import { Employee } from '../models/Employee';

@Edm.Annotate({
  term: 'UI.DisplayName',
  string: 'SalesOrdersStatus'
})
export class SalesOrderStatus {
  constructor (jsonData: any) {
    Object.assign(this, jsonData);
  }

  @Edm.Key
  @Edm.Computed
  @Edm.String
  _id: ObjectID

  @Edm.String
  key: string

  @Edm.String
  name: string

  @Edm.Double
  sortPosition: number

  @Edm.Collection(Edm.String)
  @Edm.Function
  echo() {
    return ["echotest"];
  }
}
