const express = require('express');
const cors = require('cors')
const { getAnimes, getAnimeDetails } = require('./scrape')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send({ message: 'welcome to anime api service...' })
})

app.get('/api/v1/anime/search', async (req, res) => {
    //language,q,page,sort,genre,year,type,season
    const response = await getAnimes({ ...req.query })
    res.send(response)
})

app.get('/api/v1/anime/:id/:name', async (req, res) => {
    const { id, name } = req.params
    const response = await getAnimeDetails(id, name)
    res.send(response)
})

app.listen(parseInt(process.env.CONN) || 3000);
