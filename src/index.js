const {faker} = require("@faker-js/faker");
const factorial = function fac(n) {
    return n < 2 ? 1 : n * fac(n-1);
}

console.log(factorial(10));

const map = function(func, arr) {
    let result = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        result[i] = func(arr[i]);
    }
    return result;
}
const cube = function(item) {
    return  item * item * item;
}

console.log(map(cube, [1,2,3,4,5,6,7,8,9]));

class Person {
    constructor(params) {
        this._first_name = params["first_name"];
        this._last_name = params["last_name"];
        this._age = params["age"];
        this._email = params["email"];
        this._created_at = params["created_at"];
        this._updated_at = params["updated_at"];
    }

    /**
     * @returns {String}
     */
    get firstName() {
        return this._first_name;
    }
    /**
     * @returns {String}
     */
    get lastName() {
        return this._last_name;
    }
    /**
     * @returns {String}
     */
    get email() {
        return this._email;
    }
    /**
     * @returns {Number}
     */    
    get age() {
        return this._age;
    }
    /**
     * @returns {Date}
     */        
    get createdAt() {
        return this._created_at;
    }
    /**
     * @returns {Date}
     */        
    get updatedAt() {
        return this._updated_at;
    }
}

function iterateOverArray(arr) {
    arr.length >= 1 ? doIterate(arr) : console.log("List is Empty");
}
function doIterate(arr) {
    arr.forEach(item => {
        console.log(`first Name : ${item.firstName} \r\n 
            last Name : ${item.lastName} \r\n 
            age : ${item.age} \r\n 
            email : ${item.email} \r\n
            created at : ${item.createdAt}`);
    });
}
function generatePersons(number = 10) {
    let persons = new Array(number);
    persons = faker.helpers.multiple(personGenerator, { count : number });  
    return persons;
}
function personGenerator() {
    let arguments = { 
        "first_name" : faker.person.firstName(),
        "last_name" : faker.person.lastName(),
        "age" : faker.number.int({ min : 22 , max : 35 }),
        "email" : faker.internet.email(),
        "created_at" : faker.date.recent({ days: 10}),
        "updated_at" : faker.date.recent({ days: 1}) 
    };
    return new Person(arguments);
}


let items = generatePersons();
iterateOverArray(items);