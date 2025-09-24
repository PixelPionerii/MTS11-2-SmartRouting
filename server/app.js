const express = require('express')
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');

require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);

app.get('/',(req,res) => {
    res.send("Hello world")
})

console.log('Credentials loaded:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

app.listen(3000,() => console.log("server started http://localhost:3000"))