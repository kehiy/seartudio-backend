export default class Dto {
  name: string;
  studioId: string;
  phoneNumber: number;
  address: string;
  province: string;
  type: string;
  license: string;
  pricePerHour: number;
  email: string;
  description: string;
  logo: string;
  image: string;
  isVeryfied: boolean;
  isPromoted: boolean;
  isActive: boolean;
  role:string;
  telegramId: number

  constructor(model: any) {
    this.name = model.name;
    this.studioId = model.studioId;
    this.phoneNumber = model.phoneNumber;
    this.address = model.address;
    this.province = model.province;
    this.type = model.type;
    this.license = model.license;
    this.pricePerHour = model.pricePerHour;
    this.email = model.email;
    this.description = model.description;
    this.logo = model.logo;
    this.image = model.image;
    this.isVeryfied = model.isVeryfied;
    this.isPromoted = model.isPromoted;
    this.isActive = model.isActive;
    this.role = model.role;
    this.telegramId = model.telegramId;
  }
}
