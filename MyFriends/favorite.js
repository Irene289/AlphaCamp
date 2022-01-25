// 宣告變數：主程式
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const users = JSON.parse(localStorage.getItem('favoriteList')) || []
const dataPanel = document.querySelector('#data-panel')
// 宣告變數：搜尋功能
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
let filteredUsers = []
// 宣告變數：分頁功能
const USERS_PER_PAGE = 12
let currentPage = 1
const paginator = document.querySelector('#paginator')

// 監聽器：主畫面
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.fas')) {
    removeFromFavorite(Number(event.target.dataset.id))
    // console.log(event.target.dataset.page)
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
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredUsers = users.filter((user) => user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword))

  // 沒有變數接住，所以其實可以不用 return
  if (!keyword.length) {
    alert('Please enter keyword.')
  } else if (filteredUsers.length === 0) {
    alert('No results')
  }
  renderUserList(getUsersByPage(1))
  renderPaginator(filteredUsers.length)
})

// 主函式：畫面渲染
function renderUserList(data) {
  let rawHTML = ''
  data.forEach(eachData => {
    rawHTML += `
    <div class="card text-center mx-3 mb-5" id="card" style="width: 15rem;">
      <img class="img-fluid" src=${eachData.avatar} alt="...">
      <div class="card-btn">
        <button
                class="btn btn-light btn-show-user"
                data-bs-toggle="modal"
                data-bs-target="#user-modal"
                data-id="${eachData.id}"
                >More
        </button>
        <div class="btn btn-link btn-remove-favorite">
          <i class="fas fa-heart" data-id="${eachData.id}"></i>
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

// 函式：移出收藏清單
function removeFromFavorite(id) {
  if (!users || !users.length) return
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteList', JSON.stringify(users))

  renderPaginator(users.length)

  // let page = Number(event.target.dataset.page)
  // renderUserList(getUsersByPage(page))

  renderUserList(getUsersByPage(currentPage))
}

// 函式：顯示 modal 資料
function showUserModal(id) {
  // 先將 modal 內容清空，以免出現上一個 user 的資料殘影
  if (!id) { }

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
renderPaginator(users.length)
renderUserList(getUsersByPage(currentPage))