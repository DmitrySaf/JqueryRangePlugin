
export class Human{
    name: string;
    age: number;

    constructor (name : string, age : number) {
        this.name = name;
        this.age = age;
    }
    ConsoleLog() : string {
        return `${this.name}: ${this.age}`
    }
}