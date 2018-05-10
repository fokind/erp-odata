import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { EmployeeController } from "./controllers/Employee";
import { SalesOrderController } from "./controllers/SalesOrder";
import { SalesOrderRowController } from "./controllers/SalesOrderRow";
import { CounterController } from "./controllers/Counter";

@odata.cors
@odata.namespace("Erp.OData")
@odata.controller(EmployeeController, true)
@odata.controller(SalesOrderController, true)
@odata.controller(SalesOrderRowController, true)
@odata.controller(CounterController, true)
export class ErpServer extends ODataServer{}