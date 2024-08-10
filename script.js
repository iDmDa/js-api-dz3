/*
Разработка веб-приложения:

• Создайте HTML-страницу с элементами: изображение, имя фотографа, кнопка "лайк" и счетчик лайков.
• Используя JavaScript и ваш API-ключ, получите случайное изображение из Unsplash каждый раз, когда пользователь загружает страницу.
• Отобразите информацию о фотографе под изображением.
• Реализуйте функционал "лайка". Каждый раз, когда пользователь нажимает кнопку "лайк", счетчик должен увеличиваться на единицу.

* Дополнительные задачи (по желанию):

• Добавьте функцию сохранения количества лайков в локальное хранилище, чтобы при новой загрузке страницы счетчик не сбрасывался.
• Реализуйте возможность просмотра предыдущих "фото дня" с сохранением их в истории просмотров.
*/

const accessKey = "ba7RJIDhILe57vsmrrYUrxJ0PSUoDnIAjYIv-LeXzSU";

const getData = async (page) => {
    const response = await fetch(`https://api.unsplash.com/photos/?page=${page}&client_id=${accessKey}`);
    if (!response.ok) throw new Error("Ошибка");
    const data = await response.json();
    return data;
}

async function imgCreate() {
    //let page = Math.trunc(Math.random()*53); 
    let page = 44; //Если брать листы случайно, то получается слишком большая выборка картинок, не проверить работу лайков
    const data = await getData(page);
    let imgData = data[Math.trunc(Math.random() * 10)];

    document.body.insertAdjacentHTML("beforeend", `
        <p>${imgData.alt_description}</p>
        <div><img src = "${imgData.urls.small}"></div>
        <div class = "like-box" data-id = "${imgData.user.id}"><div class = "counter"></div><button>Лайк</button></div>
        <p>${imgData.user.name}</p>
    `);

    const button = document.querySelector("button");
    const counter = document.querySelector(".counter");
    const id = document.querySelector(".like-box").dataset.id;

    counter.textContent = findLike(id);

    button.addEventListener("click", () => {
        counter.textContent = createLike(id);
    })
}

function findLike(id) {
    if (!localStorage.getItem("likes")) return 0;
    let allLikes = JSON.parse(localStorage.getItem("likes"));
    let findId = allLikes.find(like => like.id === id);
    if (findId) return findId.numLike;
    return 0;
}

function createLike(id) {
    let result = 1;
    let allLikes = [];
    if (localStorage.getItem("likes")) allLikes = JSON.parse(localStorage.getItem("likes"));

    if (!findLike(id)) {
        let like = {
            id: id,
            numLike: result
        };
        allLikes.push(like);
    } else {
        let findId = allLikes.find(like => like.id === id);
        result = ++findId.numLike;
    }

    let json = JSON.stringify(allLikes);
    localStorage.setItem("likes", json);

    return result;
}


imgCreate();