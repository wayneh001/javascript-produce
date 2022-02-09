const url = 'https://hexschool.github.io/js-filter-data/data.json';
const category = document.querySelector("#category");
const searchField = document.querySelector("#search-field");
const select = document.querySelector("#js-select");
const mobileSelect = document.querySelector("#js-moblie-select");

let data = [];
let tempData = [];
let noResult = false;
let currentCategory = '';
let criteria = '';
let currentPage = 1
let totalPage = 0

// 獲取資料
axios.get(url).then(function (res) {
    if (res.status == "200") {
        data = res.data
        // console.log(data)
    }
});

// 渲染畫面
function renderData(value) {
    str = "";
    // console.log(tempData);
    if (tempData.length === 0) {
        str += `
            <tr>
                <td colspan="7" class="text-center p-3">請輸入並搜尋想比價的作物名稱^＿^</td>
            </tr>`;
        
    } else if (noResult == true) {
        str += `
            <tr>
                <td colspan="7" class="text-center p-3">查詢不到當日的交易資訊QQ</td>
            </tr>`;
    } else {
        value.forEach(function (item) {
            str += `
                <tr class="text-center">
                    <td>${item['作物名稱']}</td>
                    <td>${item['市場名稱']}</td>
                    <td>${item['上價']}</td>
                    <td>${item['中價']}</td>
                    <td>${item['下價']}</td>
                    <td>${item['平均價']}</td>
                    <td>${item['交易量']}</td>
                </tr>`;
        })
    }
    const show = document.querySelector(".showList");
    show.innerHTML = str;
    noResult = false;
}

// 切換標籤
category.addEventListener("click", function (e) {
    currentCategory = e.target.getAttribute("data-type");
    console.log(currentCategory);
    filtering();
});

// 過濾
function filtering() {
    if (currentCategory === 'N04') {
        tempData = data.filter(function (item) {
            return item['種類代碼'] === 'N04';
        });
    } else if (currentCategory === 'N05') {
        tempData = data.filter(function (item) {
            return item['種類代碼'] === 'N05';
        });
    } else if (currentCategory === 'N06') {
        tempData = data.filter(function (item) {
            return item['種類代碼'] === 'N06';
        });
    }
    sorting(criteria);
}

// 搜尋
function search() {
    word = searchField.value
    let searchData = [];
    // console.log(word);
    if (tempData.length === 0) {
        alert('請先選擇農產品種類')
    } else {
        if (word === '') {
            alert('請輸入作物名稱');
        } else {
            searchData = tempData.filter(function (item) {
                return item['作物名稱'].includes(word);
            })
            if (searchData.length === 0) {
                noResult = true;
            }
            renderData(searchData);
        }
    }
}

// 排序選擇監聽
select.addEventListener("change", function (e) {
    criteria = e.target.value;
    // console.log(criteria);
    sorting(criteria);
});

// 進階排序選擇


// 排序
function sorting(value) {
    let sortData = [];
    if (tempData.length === 0) {
        alert('請先選擇農產品種類')
    } else {
        tempData.forEach(function (item) {
            parseInt(item[value], 10);
        })
        // console.log(typeof tempData[0][value]);
        sortData = tempData.sort(function(a, b) {
            // console.log(a[value])
            return a[value] - b[value];
        });
        // console.log(sortData);
        renderData(sortData);
    }
}

// 初始化
window.onload = function () {
    renderData(tempData);
}