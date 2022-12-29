export class User {
  constructor(
    public id: string | number,
    public username: string,
    public email: string,
    public birthDate: string,
    public country: string,
    public phone: string,
    public website: string,
    public password: string,
    public image: any
  ) {}
}
