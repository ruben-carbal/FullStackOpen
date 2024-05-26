const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB");
    })
    .catch(error => {
        console.log("error connecting to MongoDB: ", error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

// if (process.argv.length === 3) {
//     Person.find({}).then(result => {
//         console.log('phonebook:')
//         result.forEach(el => {
//             console.log(`${el.name} ${el.number}`);
//         })
//         mongoose.connection.close();
//     })
// } else {
//     const person = new Number({
//         name: process.argv[3],
//         number: process.argv[4],
//     })
    
//     number.save().then(result => {
//         console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
//         mongoose.connection.close();
//     })
// }

module.exports = mongoose.model('Number', personSchema);

