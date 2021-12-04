const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.mongoURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error)
        process.exit()
    }
};

module.exports = connectDB