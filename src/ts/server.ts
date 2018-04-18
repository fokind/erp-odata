import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { EmployeeController } from "./controllers/Employee";
import { SalesOrderController } from "./controllers/SalesOrder";

@odata.cors
@odata.namespace("Erp.OData")
@odata.controller(EmployeeController, true)
@odata.controller(SalesOrderController, true)
export class ErpServer extends ODataServer{}