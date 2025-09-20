const express = require('express')
const cors = require('cors')

const app = express();
app.use(cors())

app.get('/',(req,res) => {
    res.send("Hello world")
})

app.listen(3000,() => console.log("server started http://localhost:3000"))