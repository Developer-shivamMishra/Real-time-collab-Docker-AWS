const {createServer} = require('http');
const { Server } = require('socket.io');
const { YSocketIO } = require('y-socket.io/dist/server');
const app = require('./src/app');
const connectDB = require('./src/config/db');

const httpServer = createServer(app);
connectDB();

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const ySocketIO = new YSocketIO(io);
ySocketIO.initialize();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});
