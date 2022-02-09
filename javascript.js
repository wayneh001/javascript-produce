const url = "https://hexschool.github.io/js-filter-data/data.json";
const category = document.querySelector("#category");
const searchField = document.querySelector("#search-field");
const select = document.querySelector("#js-select");
const mobileSelect = document.querySelector("#js-moblie-select");
const advancedSelect = document.querySelector(".js-sort-advanced");
const pagenation = document.querySelector(".table-page")

let data = [];
let currentCategory = "";
let tempData = [];
let searchData = [];
let noResult = false;
let reverse = false;
let currentPage = 1;
let totalPage = 0;

// 獲取資料
axios.get(url).then(function (res) {
  if (res.status == "200") {
    data = res.data;
    // console.log(data)
  }
});

// 渲染畫面
function renderData(value) {
  let str = "";
  let totalPage = Math.ceil(value.length / 10);
  console.log(value, totalPage);
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
                    <td>${item["作物名稱"]}</td>
                    <td>${item["市場名稱"]}</td>
                    <td>${item["上價"]}</td>
                    <td>${item["中價"]}</td>
                    <td>${item["下價"]}</td>
                    <td>${item["平均價"]}</td>
                    <td>${item["交易量"]}</td>
                </tr>`;
    });
  }
  const show = document.querySelector(".showList");
  show.innerHTML = str;
  noResult = false;
}

// 切換標籤
category.addEventListener("click", function (e) {
  currentCategory = e.target.getAttribute("data-type");
  //   console.log(currentCategory);
  filtering();
  searchField.value = "";
});

// 過濾
function filtering() {
  if (currentCategory === "N04") {
    tempData = data.filter(function (item) {
      return item["種類代碼"] === "N04";
    });
  } else if (currentCategory === "N05") {
    tempData = data.filter(function (item) {
      return item["種類代碼"] === "N05";
    });
  } else if (currentCategory === "N06") {
    tempData = data.filter(function (item) {
      return item["種類代碼"] === "N06";
    });
  }
  renderData(tempData);
  select.value = "排序";
  mobileSelect.value = "排序";
}

// 搜尋
function searchring() {
  word = searchField.value;
  // console.log(word);
  if (tempData.length === 0) {
    alert("請先選擇農產品種類");
  } else {
    if (word === "") {
      alert("請輸入作物名稱");
    } else {
      searchData = tempData.filter(function (item) {
        return item["作物名稱"].includes(word);
      });
      if (searchData.length === 0) {
        noResult = true;
      }
      renderData(searchData);
      select.value = "排序";
      mobileSelect.value = "排序";
    }
  }
}

// 排序選擇
select.addEventListener("change", function (e) {
  let value = e.target.value;
  sorting(value);
});

mobileSelect.addEventListener("change", function (e) {
  let value = e.target.value;
  sorting(value);
});

// 進階排序選擇
advancedSelect.addEventListener("click", function (e) {
  let value = e.target.textContent.trim(); // 點到標籤，沒有點到 fas icon，取 div textContent;
  //   console.log(value);
  if (value !== "作物名稱" && value !== "市場名稱") {
    let caret = e.target.getAttribute("data-sort");
    if (value === "") {
      value = e.target.getAttribute("data-price"); // 點到 fas icon，取 i data-price 值;
    }
    if (caret === "down") {
      reverse = true;
    } else if (caret === "up") {
      reverse = false;
    }
    sorting(value);
    select.value = value;
    mobileSelect.value = value;
  }
});

// 排序事件
function sorting(cri) {
  if (tempData.length === 0) {
    alert("請先選擇農產品種類");
  } else {
    if (searchData.length === 0) {
      sortingMethod(tempData, cri);
    } else {
      sortingMethod(searchData, cri);
    }
  }
}

// 排序方法
function sortingMethod(data, cri) {
  let sortData = [];
  data.forEach(function (item) {
    parseInt(item[cri], 10);
  });
  sortData = data.sort(function (a, b) {
    return a[cri] - b[cri];
  });
  if (reverse == true) {
    sortData.reverse();
  }
  renderData(sortData);
  reverse = false; // 每次渲染完，重置反向
}

// 初始化
window.onload = function () {
  renderData(tempData);
};
