export default class Dto {
  id: string;
  name: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(model: any) {
    this.id = model.id;
    this.name = model.name;
    this.apiKey = model.apiKey;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
