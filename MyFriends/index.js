// 宣告變數：主程式
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const users = []
const dataPanel = document.querySelector('#data-panel')
// 宣告變數：搜尋功能
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
let filteredUsers = []
// 宣告變數：收藏功能
const list = JSON.parse(localStorage.getItem('favoriteList')) || []
// 宣告變數：分頁功能
const USERS_PER_PAGE = 12
let currentPage = 1
const paginator = document.querySelector('#paginator')

// 監聽器：主畫面
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    // console.log(event.target.dataset.id)
    showUserModal(event.target.dataset.id)
  } else if (event.target.matches('.far')) {
    addToFavorite(Number(event.target.dataset.id))
    event.target.classList.replace('far', 'fas')
  } else if (event.target.matches('.fas')) {
    removeFromFavorite(Number(event.target.dataset.id))
    event.target.classList.replace('fas', 'far')
  }
})

// 監聽器：分頁功能
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  currentPage = page
  renderUserList(getUsersByPage(currentPage))
})

// 監聽器：搜尋功能
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  // 終止元件的預設行為
  event.preventDefault()
  // 將輸入框的關鍵字存入變數
  const keyword = searchInput.value.trim().toLowerCase()

  filteredUsers = users.filter((user) => user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword))

  // 沒有變數接住，所以其實可以不用 return？
  if (!keyword.length) {
    alert('Please enter keyword.')
  } else if (filteredUsers.length === 0) {
    alert('No results')
  }
  currentPage = 1
  renderUserList(getUsersByPage(currentPage))
  renderPaginator(filteredUsers.length)
})

// 主函式：畫面渲染
function renderUserList(data) {
  let rawHTML = ''

  // 利用 forEach 迭代
  // 利用 dataset 綁定 user id
  data.forEach((eachData) => {
    let inList = false
    if (list.some((user) => user.id === eachData.id)) {
      inList = true
    }

    rawHTML += `
    <div class="card text-center mx-auto mb-5" id="card" style="width: 15rem;">
      <img class="img-fluid" src=${eachData.avatar} alt="...">
      <div class="card-btn">
        <button
                class="btn btn-light btn-show-user"
                data-bs-toggle="modal"
                data-bs-target="#user-modal"
                data-id=${eachData.id}
                >More
        </button>
        <div class="btn btn-link btn-add-favorite">
          <i class="${inList ? "fas fa-heart" : "far fa-heart"}" data-id=${eachData.id}></i>
        </div>
      </div>
    </div>
  `})
  dataPanel.innerHTML = rawHTML
}

// 函式：分頁
function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

// 函式：計算總頁數
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// 函式：加入收藏清單
function addToFavorite(id) {
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) return

  list.push(user)
  localStorage.setItem('favoriteList', JSON.stringify(list))
}

// 函式：移出收藏清單
function removeFromFavorite(id) {
  if (!list || !list.length) return

  const userIndex = list.findIndex((user) => user.id === id)
  if (userIndex === -1) return

  list.splice(userIndex, 1)
  localStorage.setItem('favoriteList', JSON.stringify(list))
}

// 函式：顯示 modal 資料
function showUserModal(id) {
  // 先將 modal 內容清空，以免出現上一個 user 的資料殘影
  if (!id) return

  const modalTitle = document.querySelector('#user-modal-title')
  const modalAvatar = document.querySelector('#user-modal-avatar')
  const modalUserInfo = document.querySelector('.modal-user-info')
  const modalEmail = document.querySelector('#user-modal-email')

  modalTitle.innerText = ''
  modalAvatar.innerHTML = ''
  modalUserInfo.innerHTML = ''
  modalEmail.href = ''
  modalEmail.innerText = ''

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data
      modalTitle.innerText = data.name + ' ' + data.surname
      modalAvatar.innerHTML = `<img src=${data.avatar}
     alt="avatar" class="img-fluid">`
      modalUserInfo.innerHTML = `
        <p><em style="text-transform: capitalize;">${data.gender}</em> in ${data.region}</p>
        <p><em>${data.age} / ${data.birthday}</em></p>
      `
      modalEmail.href = `mailto:${data.email}`
      modalEmail.innerText = data.email
    })
}

// API：axios 請求資料
function renderAllUsers() {
  axios
    .get(INDEX_URL)
    .then((response) => {
      users.push(...response.data.results)
      renderUserList(getUsersByPage(currentPage))
      renderPaginator(users.length)
    })
    .catch((err) => console.log(err))
}
renderAllUsers()