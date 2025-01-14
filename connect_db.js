const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Removed useNewUrlParser and useUnifiedTopology
        await mongoose.connect('mongodb+srv://anshu_bongade:u3ZlprcgU1fMZspR@cluster0.6hhoa.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;