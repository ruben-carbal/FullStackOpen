const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://rubengio111:${password}@cluster0.qwwygjs.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const numberSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Number = mongoose.model('Number', numberSchema);

if (process.argv.length === 3) {
    Number.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(el => {
            console.log(`${el.name} ${el.number}`);
        })
        mongoose.connection.close();
    })
} else {
    const number = new Number({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    number.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
        mongoose.connection.close();
    })
}


