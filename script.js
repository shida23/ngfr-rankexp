// チェックボックスと数値入力の状態をCookieに保存
function saveStateToCookie() {
  const checkBox1 = document.getElementById("checkBox1");
  const checkBox2 = document.getElementById("checkBox2");
  const multiplierInput = document.getElementById("multiplierInput");

  // チェックボックスと数値入力の状態をCookieに保存
  document.cookie = "checkbox1=" + checkBox1.checked + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
  document.cookie = "checkbox2=" + checkBox2.checked + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
  document.cookie = "multiplierInput=" + multiplierInput.value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

// チェックボックスと数値入力の状態をCookieから取得して復元
function restoreStateFromCookie() {
  const checkBox1 = document.getElementById("checkBox1");
  const checkBox2 = document.getElementById("checkBox2");
  const multiplierInput = document.getElementById("multiplierInput");

  // Cookieからチェックボックスと数値入力の状態を取得して復元
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] === "checkbox1") {
      checkBox1.checked = cookie[1] === "true";
    } else if (cookie[0] === "checkbox2") {
      checkBox2.checked = cookie[1] === "true";
    } else if (cookie[0] === "multiplierInput") {
      multiplierInput.value = cookie[1];
    }
  }
}

// ページが読み込まれた時にチェックボックスと数値入力の状態を復元
window.onload = function() {
  restoreStateFromCookie();
};

// チェックボックスと数値入力の状態が変更された時に保存
const checkBox1 = document.getElementById("checkBox1");
const checkBox2 = document.getElementById("checkBox2");
const multiplierInput = document.getElementById("multiplierInput");
checkBox1.addEventListener("change", saveStateToCookie);
checkBox2.addEventListener("change", saveStateToCookie);
multiplierInput.addEventListener("input", saveStateToCookie);

function updateTable() {
  const path = "xp.tsv";

  // TSVファイル読み込み
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const tsvText = xhr.responseText;
      const rows = tsvText.trim().split("\n");

      // チェックボックスの状態に応じて倍率を計算
      const checkBox1 = document.getElementById("checkBox1");
      const checkBox2 = document.getElementById("checkBox2");
      let multiplier = 1;

      if (checkBox1.checked && !checkBox2.checked) {
        multiplier += 0.15;
      } else if (!checkBox1.checked && checkBox2.checked) {
        multiplier += 0.3;
      } else if (checkBox1.checked && checkBox2.checked) {
        multiplier += 0.45;
      }
      
      // テキストボックスの値を取得し、倍率を計算
      const multiplierInput = document.getElementById("multiplierInput");
      const inputNumber = parseFloat(multiplierInput.value);
      if (!isNaN(inputNumber)) {
        multiplier += inputNumber / 100;
      }

      // テキストボックスの値を取得し、表示範囲を決定
      const startInput = document.getElementById("startInput");
      const endInput = document.getElementById("endInput");
      const startRow = parseInt(startInput.value) || 0;
      const endRow = parseInt(endInput.value) || rows.length - 1;

      // 選択されているラジオボタンをチェック
      let selectedRadioButton = null;

      // ラジオボタンの状態に応じて、列を決定
      let columnIndex = -1;
      const radioButtons = document.getElementsByName("radioButton");
      for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
        columnIndex = parseInt(radioButtons[i].value) + 2;
        selectedRadioButton = radioButtons[i]; // 選択されているラジオボタンを保存
        break;
        }
      }

      // ラジオボタンが選択されていない場合、エラーメッセージを表示
      if (selectedRadioButton === null) {
        alert("曜日(イベント)を選択してください");
        return;
      }

      // 表生成
      let tableHTML = "";
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i].split("\t");
        let rowHTML = "";
        for (let j = 0; j < row.length; j++) {
          let value = row[j];
          if ((i === 0 || (i >= startRow && i <= endRow)) && (columnIndex === -1 || j === 0 || j === columnIndex)) {
            if (i > 0 && j === columnIndex) {
              const calculatedValue = Math.round(parseFloat(row[j]) * multiplier);
              value = addCommas(calculatedValue);
            }
            rowHTML += "<td>" + value + "</td>";
          }
        }
        if (rowHTML !== "") {
          tableHTML += "<tr>" + rowHTML + "</tr>";
        }
      }

      if (tableHTML === "") {
        tableHTML += "<tr><td></td></tr>";
      }

      // 表を更新
      document.getElementById("table").innerHTML = tableHTML;
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

// 数字カンマ区切りの形式
function addCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
