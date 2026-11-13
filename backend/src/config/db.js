import mongoose from 'mongoose';
export async function connectDB(){
 if(!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required. Configure an Atlas database user and network access first.');
 await mongoose.connect(process.env.MONGODB_URI,{dbName:process.env.MONGODB_DB||'netmind_ai',serverSelectionTimeoutMS:10000});
 console.log('MongoDB connected:',mongoose.connection.name);
}
