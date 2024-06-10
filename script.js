$(document).ready(function () {
    if (localStorage.getItem('bonus')) {
      $('#bonus').val(localStorage.getItem('bonus'));
    }
    if (localStorage.getItem('start')) {
      $('#start').val(localStorage.getItem('start'));
    }
    if (localStorage.getItem('end')) {
      $('#end').val(localStorage.getItem('end'));
    }
    
    $('#rangeslider').on('input', function () {
      $('#range-number').text($(this).val());
    });
    
    function isHalfWidthDigitOrDecimal(str) {
      return /^[0-9]*\.?[0-9]+$/.test(str);
    }

    $('#displayButton').click(function () {
      var R = $('input[name="day"]:checked').val();
      var B = $('#bonus').val();
      var startRow = $('#start').val();
      var endRow = $('#end').val();
      if ((B && !isHalfWidthDigitOrDecimal(B)) || (startRow && !isHalfWidthDigitOrDecimal(startRow)) || (endRow && !isHalfWidthDigitOrDecimal(endRow))) {
        alert("使用できない文字が含まれています。半角数字で入力してください。");
        return;
      }
      var S = $('#rangeslider').val();

      localStorage.setItem('bonus', B);
      localStorage.setItem('start', startRow);
      localStorage.setItem('end', endRow);
            
      B = B ? parseFloat(B) : 0;
      S = S ? parseFloat(S) : 0;
      startRow = startRow ? parseInt(startRow, 10) : 1;
      endRow = endRow ? parseInt(endRow, 10) : null;
      $.ajax({
        url: 'xp.csv',
        dataType: 'text',
      }).done(function (data) {
        var allRows = data.split(/\r?\n|\r/);
        var totalRows = allRows.length - 1;
        if (startRow > totalRows || (endRow && endRow > totalRows)) {
          alert("280以下の数値を入力してください");
          return;
        }
        if (!endRow) {
          endRow = totalRows;
        }
        
        var headers = allRows[0].split(',');
        var tableData = [];
        for (var i = startRow; i <= endRow && i < allRows.length; i++) {
          var rowCells = allRows[i].split(',');
          if (rowCells.length == headers.length) {
            var row = [];
            for (var j = 0; j < rowCells.length; j++) {
              if (j > 0) {
                var value = parseFloat(rowCells[j]);
                if (!isNaN(value)) {
                  value = Math.floor(value * R * (1 + (B / 100)) * (1 + (S / 100)));
                  row.push(value.toLocaleString());
                } else {
                  row.push(rowCells[j]);
                }
                } else {
                  row.push(rowCells[j]);
                }
              }
              tableData.push(row);
            }
          }
          $('#resultTable').DataTable({
            destroy: true,
            data: tableData,
            columns: headers.map(header => ({ title: header })),
            paging: false,
            info: false,
            searching: false,
            ordering: false,
            scrollY: '400px',
            scrollX: true,
            scrollCollapse: true
            });
          });
          $('.accordion').css('display', 'block');
        });
        
        var modal = document.getElementById("infoModal");
        var btn = document.getElementById("infoButton");
        var span = document.getElementsByClassName("close")[0];
        btn.onclick = function() {
          modal.style.display = "block";
        }
        span.onclick = function() {
          modal.style.display = "none";
        }
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }
    
        var acc = document.getElementsByClassName("accordion");
        var i;
        for (i = 0; i < acc.length; i++) {
          acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            var icon = this.querySelector(".icon");
            if (panel.style.maxHeight) {
              panel.style.maxHeight = null;
              icon.textContent = "+";
            } else {
              panel.style.maxHeight = panel.scrollHeight + "px";
              icon.textContent = "×";
            }
          });
        }
    });
