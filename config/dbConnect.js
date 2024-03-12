import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            "mongodb+srv://agbariajameel:5ibHQBONHVWQjNuO@cluster0.a8xesrs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",

            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log(`🙃🙃 Mongo DB is connected ${conn.connection.host} 🙃🙃`);
    } catch (Error) {
        console.log(`🏮🏮🏮 ${Error} 🏮🏮🏮`);
    }
};
export default connectDB;
