const url = "https://hexschool.github.io/js-filter-data/data.json";
const category = document.querySelector("#category");
const searchField = document.querySelector("#search-field");
const display = document.querySelector("#js-crop-name")
const select = document.querySelector("#js-select");
const mobileSelect = document.querySelector("#js-moblie-select");
const advancedSelect = document.querySelector(".js-sort-advanced");
const pagenation = document.querySelector(".table-page")

let data = []; // 儲存 axios 回傳資料
let currentCategory = ""; // 儲存當前種類標籤
let tempData = []; // 畫面渲染資料
let noResult = false; // 搜尋結果判定
let searchData = []; // 儲存搜尋結果
let reverse = false; // 排序反轉判定
let currentPage = 1; // 儲存當前頁面
let currentPageGroup = 1; // 儲存當前渲染頁面組 ( 每 10 頁做渲染 )
let perPage = 30; // 儲存每頁顯示資料數 ( 未使用 )
let totalPage = 0; // 儲存總頁數

// 獲取資料
axios.get(url).then(function (res) {
  if (res.status == "200") {
    data = res.data;
    // console.log(data)
  }
});

// 渲染畫面
function renderData(value) {
  let str = '';

  if (tempData.length == 0) {
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
    noResult = false;
    let currentPageData = value.slice((currentPage - 1) * perPage, currentPage * perPage); // 頁面呈現，始 ( 含 ) 於 ( ( 當前頁面 - 1 ) * 每頁頁面 ) 的編號 ( 如第一頁始於第 [0] 筆資料 )，終 ( 不含 ) 於當前頁面 * 每頁頁面的編號，( 如第一頁終於第 [30] 筆資料 )
    currentPageData.forEach(function (item) {
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
}

// 切換標籤
category.addEventListener("click", function (e) {
  const buttons = category.querySelectorAll('button')
  buttons.forEach(function (item) {
    item.classList.remove("active");
    currentCategory = e.target.getAttribute("data-type");
    // console.log(currentCategory);
    if (currentCategory != null) {
      e.target.classList.add("active");
      searchData = [];
      filtering();
      searchField.value = "";
    }
  });
});

// 過濾
function filtering() {
  if (currentCategory == "N04") {
    tempData = data.filter(function (item) {
      return item["種類代碼"] == "N04";
    });
  } else if (currentCategory == "N05") {
    tempData = data.filter(function (item) {
      return item["種類代碼"] == "N05";
    });
  } else if (currentCategory == "N06") {
    tempData = data.filter(function (item) {
      return item["種類代碼"] == "N06";
    });
  }
  currentPage = 1;
  renderData(tempData);
  renderPage(tempData);
  select.value = "排序";
  mobileSelect.value = "排序";
}

// 搜尋
function searchring() {
  word = searchField.value;
  // console.log(word);
  if (tempData.length == 0) {
    alert("請先選擇農產品種類");
  } else {
    if (word == "") {
      alert("請輸入作物名稱");
    } else {
      searchData = tempData.filter(function (item) {
        return item["作物名稱"].includes(word);
      });
      display.innerHTML = `查看「${word}」的比價結果`
      if (searchData.length == 0) {
        noResult = true;
      } else {
        tempData = searchData;
      }
      renderData(tempData);
      renderPage(tempData);
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
    if (value == "") {
      value = e.target.getAttribute("data-price"); // 點到 fas icon，取 i data-price 值;
    }
    if (caret == "down") {
      reverse = true;
    } else if (caret == "up") {
      reverse = false;
    }
    sorting(value);
    select.value = value;
    mobileSelect.value = value;
  }
});

// 排序事件
function sorting(cri) {
  if (tempData.length == 0) {
    alert("請先選擇農產品種類");
  } else {
    if (searchData.length == 0) {
      sortingMethod(tempData, cri);
    } else {
      tempData = searchData;
      sortingMethod(tempData, cri);
    }
  }
}

// 排序方法
function sortingMethod(data, cri) {
  data.forEach(function (item) {
    parseInt(item[cri], 10);
  });
  tempData = data.sort(function (a, b) {
    return a[cri] - b[cri];
  });
  if (reverse == true) {
    tempData.reverse();
  }
  currentPage = 1;
  renderData(tempData);
  reverse = false; // 每次渲染完，重置反向
}

// 渲染頁碼
function renderPage(value) {
  let str = '';
  let page = [];
  totalPage = Math.ceil(value.length / perPage);
  currentPageGroup = Math.ceil(currentPage / 10);
  if (noResult == true) {
    str = '';
  } else {
    if (currentPageGroup == Math.ceil(totalPage / 10)) {
      for (i = currentPageGroup * 10 - 9; i <= totalPage; i++) {
        page += `<li class="page" data-page=${i} onclick="pageChange(${i})">${i}</li>`;
      }
    } else {
      for (i = currentPageGroup * 10 - 9; i <= currentPageGroup * 10; i++) {
        page += `<li class="page" data-page=${i} onclick="pageChange(${i})">${i}</li>`;
      }
    }
    str += `
      <li class="page-prev-ten" data-page=0 onclick="pageChange(currentPage - 10)"><i class="fas fa-angle-double-left"></i></li>
      <li class="page-prev" data-page=0 onclick="pageChange(currentPage - 1)"><i class="fas fa-angle-left"></i></li>
      ${page}
      <li class="page-next" data-page=0 onclick="pageChange(currentPage + 1)"><i class="fas fa-angle-right"></i></li>
      <li class="page-next-ten" data-page=0 onclick="pageChange(currentPage + 10)"><i class="fas fa-angle-double-right"></i></li>
    `;
  }
  pagenation.innerHTML = str;
  pagenation.classList.add("visible");
  noResult = false;
  if (str != '') {
    pageStyle();
  }
}

// 頁碼樣式變化
function pageStyle() {
  const pages = pagenation.querySelectorAll('.page');
  pages[0].classList.add("page-active");
  pagenation.querySelector('.page-prev').classList.remove('page-not-active');
  pagenation.querySelector('.page-next').classList.remove('page-not-active');
  pagenation.querySelector('.page-prev-ten').classList.remove('page-not-active');
  pagenation.querySelector('.page-next-ten').classList.remove('page-not-active');
  if (currentPage == 1) {
    pagenation.querySelector('.page-prev').classList.add('page-not-active');
    pagenation.querySelector('.page-next').classList.add('page-not-active');
  } else if (currentPage == totalPage) {
    pagenation.querySelector('.page-next').classList.add('page-not-active');
  }
  if (currentPageGroup == 1) {
    pagenation.querySelector('.page-prev-ten').classList.add('page-not-active');
  }
  // if (currentPageGroup == Math.ceil(totalPage / 10)) {
  //   pagenation.querySelector('.page-next-ten').classList.add('page-not-active');
  // }
  pages.forEach(function (item) {
    item.classList.remove("page-active");
    if (currentPage == item.getAttribute("data-page")) {
      item.classList.add("page-active");
    }
  })
}

// 跳轉頁碼
function pageChange(value) {
  if (value <= 0) {
    currentPage = 1;
  } else if (value >= totalPage) {
    currentPage = totalPage;
  } else {
    currentPage = value;
  }
  renderPage(tempData);
  pageStyle();
  renderData(tempData);
}

// 初始化
window.onload = function () {
  renderData(tempData);
};
