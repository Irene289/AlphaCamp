const links = [
  {
    id: "",
    description: "首頁"
  },
  {
    id: "about",
    description: "About"
  },
  {
    id: "portfolio",
    description: "Portfolio"
  },
  {
    id: "contact",
    description: "Contact"
  }
]
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
  res.render('home', { nav_link: links })
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})