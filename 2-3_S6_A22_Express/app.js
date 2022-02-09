const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('home')
})
app.get('/:nav_link', (req, res) => {
  const nav_link = req.params.nav_link
  res.render('home', { nav_link })
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})