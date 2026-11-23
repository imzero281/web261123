// app.js : 영화 배열을 다루는 함수 6개 / 이찬미(26) / 10주차 
// average : 영화 배열 ⇒ 평균 평점(숫자) 

const average = (list) => {
    let sum = 0;
    for (const m of list) {
        sum += m.rating;
    }
    return sum / list.length;
}

console.log("평균:", average(movies));

//영화 배열 ⇒ 평점이 가장 높은 영화 객체
const best = (list) => {
    let top = list[0];
    for (const m of list) {
        if (m.rating > top.rating) {
            top = m;
        }
    }
    return top;
}
console.log("최고:", best(movies).title);


//영화 배열, 최소 평점 ⇒ 그 이상인 영화만 담은 새 배열
const filterByRating = (list, min) => {
    return list.filter(m => m.rating >= min);
}
console.log("8점 이상:", filterByRating(movies, 8).length + "편");


/*영화 배열 ⇒ 평점 높은 순으로 정렬한 새 배열(원본은 그대로)
const sortByRating = (list) => {
    return [...list].sort((a, b) => b.rating - a.rating);
}
const sorted = sortByRating(movies);
console.log("정렬 1위:", sorted[0].title, "/ 원본 1번:", movies[0].title);*/ //실습서 5번에서 지워도 된다고 함


//날짜 문자열 ⇒ 올해까지 몇 년(숫자)
const yearsSince = (dateStr) => {
    return new Date().getFullYear() - new Date(dateStr).getFullYear();
}
console.log(yearsSince(movies[0].date) + "년 전 개봉");


//포스터 경로, 크기 ⇒ TMDB 이미지 주소(문자열)
const posterUrl = (path, size) => {
    return "https://image.tmdb.org/t/p/" + size + path;
}
console.log(posterUrl(movies[0].poster, "w342"));

// renderCards : 영화 배열 ⇒ 보드에 카드 생성(반환값 없음)
function renderCards(list) {
    const board = document.querySelector(".board");
    board.innerHTML = "";
    for (const m of list) {
        const card = document.createElement("article");
        card.className = "card";
        if (m.rating >= 8) { card.classList.add("hot"); }
        card.innerHTML = `
      <img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">
      <span class="badge">${m.rating}</span>
      <div class="info">
        <h2>${m.title}</h2>
        <p class="year">${m.year}</p>
        <button class="like" type="button">♥</button>
      </div>`;
        board.appendChild(card);
        card.dataset.id = m.id;
        card.onclick = function () { alert(m.overview); };
    }
    document.getElementById("count").textContent = list.length + "편";
    updateLikeCount();

    if (list.length === 0) {
        board.classList.add("is-empty");
    } else {
        board.classList.remove("is-empty");
    }
}

// sortBy : 영화 배열, 키 이름, 내림차순 여부 ⇒ 정렬한 새 배열(원본은 그대로)
function sortBy(list, key, desc) {
    const copy = [...list];
    copy.sort((a, b) => {
        if (typeof a[key] === "string") return a[key].localeCompare(b[key]);
        return a[key] - b[key];
    });
    if (desc) copy.reverse();
    return copy;
}


// applySort : 선택 상자 값으로 정렬해서 다시 그리기(반환값 없음)
function applySort() {
    renderCards(getView());
}

//renderCards(movies);
applySort();
// 검색창 : 글자를 칠 때마다 제목으로 걸러서 다시 그리기
document.getElementById("q").addEventListener("input", (e) => {
    renderCards(getView());
});

document.getElementById("sort").addEventListener("change", applySort);

// getView : 없음 => 검색어로 거른 뒤 선택 상자 기준으로 정렬한 새 배열
function getView() {
    const keyword = document.getElementById("q").value.trim().toLowerCase();
    const found = movies.filter(m => m.title.toLowerCase().includes(keyword));
    const key = document.getElementById("sort").value;
    return sortBy(found, key, key !== "title");
}

//화살표함수 : this는 window를 가리키고, e.target은 실제로 누른 버튼을 가리킴.
//일반 함수 : this는 .board를 가리키고, e.target은 실제로 누른 버튼을 가리킴.
document.querySelector(".board").addEventListener("click", function (e) {
    if
        (e.target.classList.contains("like")) {
        e.target.classList.toggle("liked");
        updateLikeCount();
    }
});

function updateLikeCount() {
    document.getElementById("likeCount").textContent = document.querySelectorAll(".liked").length;
}

document.getElementById("q").addEventListener("keydown", (e) => {
    if (e.key === "Escape") { 
        e.target.value = ""; 
        renderCards(getView()); 
    }
});