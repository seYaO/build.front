var birth = '1990/01/01';
var person = {
    name: "123",
    birth,
    hello() {
        console.log('my name is', this.name);
    }
}