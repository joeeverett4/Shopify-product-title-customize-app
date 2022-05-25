import mongoose from 'mongoose';


export default async function connectDB(){
  try {
    await mongoose.connect( "mongodb+srv://joeeverett:capablanca1@cluster0.fae78.mongodb.net/cluster0?retryWrites=true&w=majority", {
      useNewUrlParser: true
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

