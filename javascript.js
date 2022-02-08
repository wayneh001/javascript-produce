const url = 'https://hexschool.github.io/js-filter-data/data.json';
const category = document.querySelector("#category");
const searchField = document.querySelector("#search-field");
const search = document.querySelector("#search");
const select = document.querySelector("#js-select");
const mobileSelect = document.querySelector("#js-moblie-select");

let obj = {};
let data = [];
let tempData = [];
let currentCategory = '蔬果';

// 獲取資料
axios.get(url).then(function (res) {
    if (res.status == "200") {
        data = res.data
        console.log(data)
    }
});

// 渲染畫面
function renderData(value) {
    str = "";
    value.forEach(function (item) {
        if (searchField.textContent === '') {
            str += `
                <td colspan="7" class="text-center p-3">請輸入並搜尋想比價的作物名稱^＿^</td>`;
        } else {
            str += `
                <td colspan="7" class="text-center p-3">${item['作物名稱']}</td>
                <td colspan="7" class="text-center p-3">${item['市場名稱']}</td>
                <td colspan="7" class="text-center p-3">${item['上價']}</td>
                <td colspan="7" class="text-center p-3">${item['中價']}</td>
                <td colspan="7" class="text-center p-3">${item['下價']}</td>
                <td colspan="7" class="text-center p-3">${item['平均價']}</td>
                <td colspan="7" class="text-center p-3">${item['交易量']}</td>`;
        }
    })
    const show = document.querySelector(".showList");
    show.innerHTML = str;
}

// 切換標籤
category.addEventListener("click", function (e) {
    const btn = document.querySelectorAll(".tab button");
})

// 搜尋
search.addEventListener("click", function (e) {

})

// 排序
select.addEventListener("click", function (e) {

})

// 進階排序
mobileSelect.addEventListener("click", function (e) {

})

// 初始化
function init() {
    renderData(tempData)
}



