import { ObjectID } from "mongodb";
import { Edm, odata } from "odata-v4-server";

@Edm.Annotate({
    term: "UI.DisplayName",
    string: "Employees"
})
export class Employee{
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

    @Edm.String
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Name"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
    code:string
}
