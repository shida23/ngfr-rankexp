//ローカルストレージ保存、読み込み
window.addEventListener('DOMContentLoaded', () => {
  // 保存された値を復元
  if (localStorage.getItem('bonus')) {
    document.getElementById('bonus').value = localStorage.getItem('bonus');
  }
  if (localStorage.getItem('range')) {
    const rangeVal = localStorage.getItem('range');
    document.getElementById('range').value = rangeVal;
    document.getElementById('rangeValue').innerText = '+' + rangeVal + '[%]';
  }
  if (localStorage.getItem('startRange')) {
    document.getElementById('startRange').value = localStorage.getItem('startRange');
  }
  if (localStorage.getItem('endRange')) {
    document.getElementById('endRange').value = localStorage.getItem('endRange');
  }

  // 「表示」ボタンを押した時に保存
  document.getElementById('displayButton').addEventListener('click', function () {
    const bonus = document.getElementById('bonus').value;
    const range = document.getElementById('range').value;
    const startRange = document.getElementById('startRange').value;
    const endRange = document.getElementById('endRange').value;

    localStorage.setItem('bonus', bonus);
    localStorage.setItem('range', range);
    localStorage.setItem('startRange', startRange);
    localStorage.setItem('endRange', endRange);
  });
});



$(document).ready(function () {
  $('#displayButton').on('click', function () {
    // d：曜日の倍率
    // b：パッシブやメンバーノギメモ、マンスリーパスによる経験値ボーナスの合計
    // r：上振れ補正
    // s：表示ステージ開始行
    // e：表示ステージ終了行
    const d = parseFloat($('input[name="dayMultiplier"]:checked').val());
    const b = parseFloat($('#bonus').val()) || 0;
    const r = parseFloat($('#range').val());
    const s = parseInt($('#startRange').val(), 10) || null;
    const e = parseInt($('#endRange').val(), 10) || null;

    // csvファイル読み込み
    $.get('xp.csv', function (data) {
      const rows = data.trim().split('\n').map(row => row.split(','));
      const headerRow = rows[0];
      const dataRows = rows.slice(1);

      // 範囲指定、ヘッダー分の補正
      let filteredRows = dataRows;
      if (s !== null) filteredRows = filteredRows.slice(s - 1);
      if (e !== null) filteredRows = filteredRows.slice(0, e - (s || 1) + 1);

      // 計算、フォーマット
      const updatedRows = filteredRows.map(row =>
        row.map((cell, index) => {
          if (index === 0) return cell;
          const value = parseFloat(cell);
          if (isNaN(value)) return cell;
          const newValue = Math.floor(value * d * (1 + b / 100) * (1 + r / 100));
          return newValue.toLocaleString();
        })
      );

      // 表示
      const $table = $('#xpTable');
      $table.empty();
      const $thead = $('<thead>').append(
        $('<tr>').append(headerRow.map(header => $('<th>').text(header)))
      );
      const $tbody = $('<tbody>').append(
        updatedRows.map(row =>
          $('<tr>').append(row.map(cell => $('<td>').text(cell)))
        )
      );

      $table.append($thead).append($tbody);

      // DataTableのカスタマイズ
      if ($.fn.DataTable.isDataTable('#xpTable')) {
        $('#xpTable').DataTable().destroy();
      }
      $('#xpTable').DataTable({
        scrollX: true,
        scrollY: "300px",
        scrollCollapse: true,
        autoWidth: false,
        ordering: false,
        searching: false,
        lengthChange: false,
        paging: false,
        info: false,
        columnDefs: [
          { targets: "_all", className: "dt-nowrap" }
        ],
        fixedColumns: {
          leftColumns: 1
        }
      });
    });
  });
});



document.addEventListener("DOMContentLoaded", function () {
  const footer = document.querySelector(".accordion-footer");
  const toggle = document.getElementById("footerToggle");

  toggle.addEventListener("click", () => {
    footer.classList.toggle("open");
    toggle.textContent = footer.classList.contains("open")
      ? "説明書 ▲"
      : "説明書 ▼";
  });
});