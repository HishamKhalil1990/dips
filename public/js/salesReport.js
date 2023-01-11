$(document).ready(function () {
    let initialDate = new Date()
    initialDate = initialDate.toISOString().split('T')[0]
    document.getElementById("start").defaultValue = initialDate
    document.getElementById("end").defaultValue = initialDate
    syncData(initialDate,initialDate)
    $("#reportSearch").on("click", () => {
        const start = $("#start").val()
        const end = $("#end").val()
        syncData(start,end)
    });
    $('#goBackBtu').on('click',()=>{
        goToPage('goTransaction')
      });
      $('#goHomeBtu').on('click',()=>{
          goToPage('goTransaction')
      });
})

const syncData = (start,end) => {
    showModal('waiting')
    if(start && end){
        if(Date.parse(start) <= Date.parse(end)){
            $.post(`/Report/data/${start}/${end}`).then(data => {
                if(data != 'error'){
                    $('#reportTable').html(data)
                    hideModal('waiting')
                }else{
                    $('#reportTable').html("")
                    hideModal('waiting')
                    alert("الرجاء حاول مرة اخرى");
                }
            })
         }else{
            hideModal('waiting')
            alert('تاريخ النهاية اقدم نت تاريخ البداية')
         }
    }else{
        hideModal('waiting')
        alert('الرجاء ادخال جميع التواريخ المطلوبة')
    }
}


const showModal = (type) => {
    $("#demo-modal").removeClass("modal");
    $("#demo-modal").addClass("modal-v");
    switch (type) {
      case "submit":
        $(".modal_sendDataBack_container").attr("style", "display:flex;");
        break;
      case "net-error":
        $(".modal_netError_container").attr("style", "display:flex;");
        break;
      case "success":
        $(".modal_success_container").attr("style", "display:flex;");
        break;
      case "noData":
        $(".modal_noData_container").attr("style", "display:flex;");
        break;
      case "waiting":
        $(".modal_waiting_container").attr("style", "display:flex;");
        break;
      case "notes":
        $(".modal_notes_container").attr("style", "display:flex;");
        break;
      default:
        break;
    }
  };
  
  const hideModal = (type) => {
    $("#demo-modal").removeClass("modal-v");
    $("#demo-modal").addClass("modal");
    switch (type) {
      case "submit":
        $(".modal_sendDataBack_container").attr("style", "display:none;");
        break;
      case "net-error":
        $(".modal_netError_container").attr("style", "display:none;");
        break;
      case "success":
        $(".modal_success_container").attr("style", "display:none;");
        break;
      case "noData":
        $(".modal_noData_container").attr("style", "display:none;");
        break;
      case "notes":
        $(".modal_notes_container").attr("style", "display:none;");
        break;
      case "waiting":
        $(".modal_waiting_container").attr("style", "display:none;");
        break;
      default:
        break;
    }
  }

  const goToPage = (page) => {
    $.get('/Routing').then(data => {
      $('#body').html(data)
      $(document).ready(function() {
          setTimeout(() => {
              document.getElementById(`${page}`).click();
          },1000)
      })
    });
  }