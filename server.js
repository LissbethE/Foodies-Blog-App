const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

//////////////////////////////////

const MONGODB_URI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE__PASSWORD,
);

const dbConnect = async function () {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose
    .connect(MONGODB_URI, options)
    .then(() => console.log('🟢 DB Connection Successful! ✅'));

  mongoose.connection.on('connected', () => {
    console.log('🟢 DB Connection Successful! ✅');
  });

  mongoose.connection.on('error', (error) => {
    console.error.bind(console, `💥 Error while connecting to db: ${error}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log(`💥 MongoDB Connection Disconnected`);
  });
};

dbConnect();

//////////////////////////////////
// START SERVER

const port = process.env.PORT || 3000 || 8080;
const server = app.listen(port, () =>
  console.log(`⚡ Listening to port: ${port}`),
);

//////////////////////////////////
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');

  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
