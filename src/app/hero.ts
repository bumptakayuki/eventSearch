export class Hero {

  constructor(
    public id: number,
    public name: string,
    public place: string,
    public date,
    public spinner: boolean,
    public alterEgo?: string
  ) {  }
}
