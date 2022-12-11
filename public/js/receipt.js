let pageOption = 'docNum'
const docNumDiv = `<div class="demo-container"><div class="demo-flex-spacer"></div><div class="webflow-style-input"><input class="input-po" type="number" min="1" step="1" placeholder="Insert P.O Number"></input><button id="poNumBtu" type="submit">send</button></div></div><div style="margin-top: 25px;display: flex;justify-content: center;align-items: center;position: relative;"><div style="position: absolute;top: 0px;display: flex;justify-content: center;align-items: center;"><div id='poTable' style="min-height: 150px;overflow-y: scroll;overflow-x: hidden;display: flex;justify-content: center;align-items: center;"></div></div></div>`
const spinner = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`
const buttons  = `<div class="btuLoctaion"><botton id="report" class="btu"><p class="para">Report</p></botton><botton id="submitOrder" class="btu" style="margin-left: 30px;"><p class="para">Submit</p></botton><botton id='close1' class="btu" style="margin-left: 30px;"><p class="para">close</p></botton><botton id='exit' class="btu" style="margin-left: 30px;"><p class="para">Exit</p></botton></div>`
const poMsg = `<div id="poMsgCont"></h2></div>`
const poNumsTable = ``
let poNumber;
let poNumList;
let begin = new Date()
begin = begin.toISOString().split('T')[0]
begin = new Date(begin).toISOString();
$(document).ready(() => {
    showDocNum() 
    $('.netError_accept2').on('click',()=>{
        hideModal("net-error2")
        const docNumValue = $('.input-po').val()
        if(docNumValue != ""){
            showTable(docNumValue)
        }else{
          alert('الرجاء ادخال رقم الطلبية')
        }
    });
    $(".confirm_btu").on("click", () => {
      hideModal("confirm");
      setTimeout(() => {
        tryToSubmit();
      }, 100);
    });
    $(".netError_accept3").on("click", () => {
      hideModal("net-error3");
      tryToSubmit();
  });
  $('#goBackBtu').on('click',()=>{
    if(pageOption == 'inputMode'){
      goToPage('goTransaction')
    }else{
      closeTable()
    }
  });
  $('#goHomeBtu').on('click',()=>{
      goToPage('goTransaction')
  });
})

const showDocNum = () => {
    pageOption = 'inputMode'
    document.getElementById('receiptDucNo').innerHTML = docNumDiv
    if(poNumList == undefined){
      document.getElementById('poTable').innerHTML = spinner
      $.get('/Receipt/PoNums').then(msg => {
        document.getElementById('poTable').innerHTML = poMsg
        if(msg == 'error'){
          document.getElementById('poMsgCont').innerHTML = `<h2 style="color:red;text-align: right;min-width: 500px;">الرجاء التاكد من شبكة الانترنت واعادة المحاولة مرة اخرى</h2>`
        }else{
          if(msg.length == 0){
            document.getElementById('poMsgCont').innerHTML = `<h2 style="text-align: right;min-width: 362px;">لا يوجد طلبات للاستلام حاليا</h2>`
          }else{
            poNumList = msg
            createPOnumsTable(msg)
          }
        }
      })
    }else{
      console.log(poNumList)
      document.getElementById('poTable').innerHTML = poMsg
      if(poNumList.length != 0){
        createPOnumsTable(poNumList)
      }else{
        document.getElementById('poMsgCont').innerHTML = `<h2 style="text-align: right;min-width: 280px;">تم استلام جميع الطلبات</h2>`
      }
    }
    $('#poNumBtu').on('click',() => {
        const docNumValue = $('.input-po').val()
        if(docNumValue != ""){
            showTable(docNumValue)
        }else{
          alert('الرجاء ادخال رقم الطلبية')
        }
    })
}

const createPOnumsTable = (poNums) => {
  let trs = ""
  poNums.forEach(po => {
    trs += `<tr style="border-bottom: 1px solid black;" class="trEfects">
      <td style="padding: 10px 15px;">${po.CardCode}</td>
      <td style="padding: 10px 15px;">${po.CardName}</td>
      <td style="padding: 10px 15px;">${po.DocNum}</td>
      <td style="padding: 10px 15px;">${po.Comments == ""? "لا يوجد ملاحظات" : po.Comments}</td>
      <td style="padding: 10px 15px;"><button onClick="fillPoNumber(${po.DocNum})">Select</button></td>
    </tr>`
  })
  document.getElementById('poMsgCont').innerHTML = `<div style="max-height: 240px;overflow-y: scroll;border: 4px solid black;">
    <table style="min-width:750px;border:solid 1px black">
      <thead>
        <tr style="border-bottom: 1px solid black;">
          <th style="padding: 15px">Card Code</th>
          <th style="padding: 15px">Vendor Name</th>
          <th style="padding: 15px">P.O Number</th>
          <th style="padding: 15px">Comments</th>
          <th style="padding: 15px">Select</th>
        </tr>
      </thead>
      <tbody id="poTableBody">
      </tbody>
    </table>
  </div>`
  document.getElementById('poTableBody').innerHTML = trs
}

const fillPoNumber = (number) => {
  $('.input-po').val(number)
}

const removePOnum = () => {
  poNumList = poNumList.filter(po => po.DocNum =! poNumber)
}

const showTable = async (number) => {
    showModal('request') 
    $.post(`/Receipt/Sync/${number}`).then(msg => {
        if(msg == 'error'){
            setTimeout(() => {
                changeModalCont('net-error2','request');
            },1000)
        }else{
            setTimeout(() => {
                if(msg != 'not found'){
                    poNumber = number
                    createTable(msg)
                    hideModal('request');
                }else{
                    changeModalCont('notFound','request');
                    setTimeout(() => {
                        hideModal('notFound')
                    },1500)
                }
            },1000)
        }
    })
}

const closeTable = () => {
    const tableDiv = $('#receiptTable');
    const btuDiv = $('.otterDiv');
    try {
        document.getElementById("tbody").removeEventListener("click", tbodyFunc);
    } catch (err) {
        console.log(err);
    }
    tableDiv.empty();
    btuDiv.empty();
    showDocNum() 
}

const createTable = (table) => {
    pageOption = 'receiptTable'
    const poDiv = $('#receiptDucNo');
    const tableDiv = $('#receiptTable');
    const btuDiv = $('.otterDiv');
    poDiv.empty();
    tableDiv.html(table);
    $("#example").DataTable();
    btuDiv.html(buttons);
    try {
        document.getElementById("tbody").addEventListener("click", tbodyFunc);
    } catch (err) {
        console.log(err);
    }
    $("#submitOrder").on("click", () => {
      showModal("confirm")
    });
    $(".close_btu").on("click", () => {
      hideModal("confirm");
    });
    $("#report").on("click", (e) => {
    const txt = $("#report p")[0].innerHTML.trim();
    if (txt == "Report") {
        showReport();
    } else {
        showAllReports();
    }
    });
    $(".netError_denied3").on("click", () => {
        hideModal("net-error3");
    });
    $("#exit").on("click", (e) => {
        const txt = $("#exit p")[0].innerHTML.trim();
        if (txt == "Exit") {
        showTransaction();
        } else {
        logOut();
        }
    });
    $("#close1").on("click", (e) => {
        closeTable()
    });
}

const tbodyFunc = (e) => {
    const fullID = e.path[0].id;
    const arr = fullID.split("-");
    const id = arr[1];
    inputOrder(id);
}

const inputOrder = (id) => {
    $(`#input-${id}`).focus();
    const input = $(`#input-${id}`);
    const value = input.val();
    let previousVal = false;
    if (value > 0) {
      previousVal = true;
      edit(id);
    }
    $(`#input-${id}`).on("blur", () => {
      save(id, input, previousVal);
      input.off("blur");
      document.getElementById(`input-${id}`).removeEventListener('keydown',tabFunc)
    });
    const tabFunc = (e) => {
      if(e.key == 'Tab'){
          setTimeout(() => {
            const active = document.querySelector(":focus")
            active.click()
          },100)
      }
    }
    document.getElementById(`input-${id}`).addEventListener('keydown',tabFunc)
};

const edit = (id) => {
    const tr = $(`#tr-${id}`);
    tr.removeClass("active-input");
    tr.removeClass("semi-active");
    tr.addClass("hide");
    tr.css("background-color", "");
  };

const save = (id, input, previousVal) => {
    const tr = $(`#tr-${id}`);
    let value = input.val();
    if (value == "") {
      if (previousVal) {
        setOrderValueZero(id);
      }
      input.val("");
    } else if (value.toString()[0] == "-") {
      if (previousVal) {
        setOrderValueZero(id);
      }
      input.val("");
      alert("يرجى ادخال قيمة صحيحة");
    } else {
      value = trim(value);
      const checked = check(value, id);
      if (checked) {
        if (value != 0) {
            $.post(`/Receipt/Save/${id}/${value}`).then((msg) => {
                if (msg == "error") {
                  alert(
                    "IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم"
                  );
                  input.val("");
                } else {
                  tr.addClass("active-input");
                  tr.removeClass("hide");
                  tr.css("background-color", "green");
                }
            });
        } else {
          if (previousVal) {
            setOrderValueZero(id);
          }
          input.val("");
        }
      } else {
        if (previousVal) {
          setOrderValueZero(id);
        }
        alert("(0 - Qty Receipt) الكمية يجب ان تكون بين");
        input.val("");
      }
    }
    return;
};

const trim = (value) => {
    const str = value.toString();
    const arr = str.split(".");
    let leftStr = arr[0];
    leftStr = parseInt(leftStr);
    leftStr = leftStr.toString();
    let newStr = arr[1] ? `${leftStr}.${arr[1]}` : `${leftStr}`;
    return parseFloat(newStr);
  };

  const check = (value, id) => {
    const QtyRec = $(`#QtyRec-${id}`);
    const maxValue = QtyRec[0].innerHTML;
    if (value <= maxValue) {
      return true;
    } else {
      return false;
    }
  };

const setOrderValueZero = async (id) => {
    $.post(`/Receipt/Save/${id}/0`).then((msg) => {
      if (msg == "error") {
        alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم");
      }
    });
  };

  const showTransaction = () => {
    $.get("/Routing").then((data) => {
      $("#body").html(data);
      $(document).ready(function () {
        document.getElementById("goTransaction").click();
      });
    });
  };
  
  const logOut = () => {
    $.post("/LogOut").then((data) => {
      $("#body").html(data);
      $(document).ready(function () {
        document.getElementById("goLogin").click();
      });
    });
  };

  const showReport = () => {
    setTimeout(() => {
      $.get(`/Receipt/Report`).then((results) => {
        if (results == "error") {
          alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم");
        } else {
          $("#reportDiv").html(results);
          $(document).ready(() => {
            $("#close").on("click", (e) => {
              $("#reportDiv").empty();
            });
          });
        }
      });
    }, 100);
  };

  const tryToSubmit = () => {
    $("body").attr("style", "height:100%");
    showModal("submit");
    $.post(`/Receipt/Submit`).then((msg) => {
      if (msg == "done") {
        removePOnum()
        setTimeout(() => {
          hideModal("submit");
          $("#tbody").empty();
          $("body").attr("style", "height:100%");
          setTimeout(() => {
            showModal("success");
            setTimeout(() => {
              $("#exit p")[0].innerHTML = "Log out";
              $("#report p")[0].innerHTML = "Sent report";
              hideModal("success");
            }, 1000);
          }, 500);
        }, 1000);
      } else if (msg == "error") {
        setTimeout(() => {
          changeModalCont("net-error3", "submit");
        }, 1000);
      } else if (msg == "no data sent") {
        changeModalCont("noData", "submit");
        setTimeout(() => {
          hideModal("noData");
        }, 1000);
      }
    });
  };

  const showAllReports = () => {
    let end= new Date().toISOString();
    $.get(`/Receipt/AllReports/${poNumber}/${begin}/${end}`).then((results) => {
      if (results == "error") {
        alert("IT خطأ داخلي الرجاء المحاولة مرة اخرى او طلب المساعدة من قسم");
      } else {
        $("#reportDiv").html(results);
        $(document).ready(() => {
          $("#close").on("click", (e) => {
            $("#reportDiv").empty();
          });
        });
      }
    });
  };