import InterfaceStrategy from './interface';

class ContextStrategy extends InterfaceStrategy {
    private _sheet;
    
    constructor(sheet: any) {
        super();
        this._sheet = sheet;
    }

    async Create(data: any) :Promise<any> {
        return this._sheet.Create(data);
    }

    async CreateList(list: []): Promise<void> {
        return this._sheet.CreateList(list);
    }

    async GetAll() :Promise<any> {
        return this._sheet.GetAll();
    }

    async GetById(id:any) :Promise<any> {
        return this._sheet.GetById(id);
    }

    async GetByDescription(description:any) :Promise<any> {
        return this._sheet.GetByDescription(description);
    }

    async Update(id:any, data:any) :Promise<any> {
        return this._sheet.Update(id, data);
    }

    async Delete(id:any) :Promise<any> {
        return this._sheet.Delete(id);
    }

    async CheckIfDocumentExist(data: any): Promise<any> {
        return this._sheet.CheckIfDocumentExist(data);
    }
}

module.exports = ContextStrategy;