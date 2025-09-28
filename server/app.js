const express = require('express')
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const agentRoutes = require('./routes/agentRoutes');
const adminRoutes = require('./routes/adminRoutes');

require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send("Hello world")
})

console.log('Credentials loaded:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => { console.log(`Server started on port ${PORT}`); });