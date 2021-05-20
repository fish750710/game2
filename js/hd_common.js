// id为活动id
  let p = 1;
  let total = 0;
  let account = "";
  let dataTime = [];

  let initHd = (id, point) => {
    // console.log("id", id, point);
    p = point;
    if (dataTime === [] || dataTime.length === 0) {
      let url = Com.Url.localUrl2 + Com.Url.Method.actGetInfo;
      let data = {
        Id: id,
        companyId: 13,
      };
      Com.Ajax(url, data, "GET", function (res) {
        // console.log("res", res)
        for (let i = 0; i < res.data.time_text.length; i++) {
          res.data.time_text[i] && dataTime.push(res.data.time_text[i]);
        }
      });
    }
    initAccount();
  };
  let initAccount = (loginName) => {
    // 讀取移動端登入帳號
    Com.getInfo(function (data) {
      account = account || data.account || loginName || "";
      if (account.length > 3) {
        $(".activity-btn1").hide();
        $(".btnExit").show();
        p === 0 ? $(".btnStart").show() : null;
        // console.log('login',btnListnerInit)
        // btnListnerInit()
        // let top = $("#gameStage").offset().top;
        // Com.browserRedirect() && window.scrollTo(0, top-20);
        if (p >= 1) {
          let event_code = dataTime[p + 3].remark;
          let event_Type2 = "center";
          // let event_Type ='zt';
          let getAccountEventStatus = new Promise((resolve, reject) => {
            let url1 = Com.Url.localUrl + Com.Url.Method.getAccountEventStatus;
            let data1 = {
              login: account,
              eventCode: event_code,
              eventType: event_Type2,
            };
            Com.Ajax(
              url1,
              data1,
              "GET",
              function (res) {
                // console.log("查詢有無報名", res)
                res.data === 0
                  ? resolve(res.data)
                  : $(".popMsg > .title").text("已参予过此活动"),
                  $(".msgText").text("");
              },
              function (err) {
                console.log("查詢有無報名ERROR", err);
                // toast("請联系客服")
                //   $(".goService").show();
              }
            );
          });

          getAccountEventStatus
            .then((state) => {
              if (state === 0) {
                let url1 = Com.Url.localUrl + Com.Url.Method.activityBounty;
                let data1 = {
                  login: account,
                  event_code: event_code,
                  company_id: 13,
                  event_type: event_Type2,
                };
                Com.Ajax(
                  url1,
                  data1,
                  "GET",
                  function (res) {
                    // console.log("res3", res)
                    let code = res.data.code;
                    if (code === "200") {
                      $(".popMsg > .title").text("报名成功");
                      $(".msgText").text("请对应于下方奖励资格");
                      //   toast("报名成功")
                      // p===1 ? total+=100 : p===2 ? total+=200 : p===3 ? total+=300 : null;
                      // total===0 ? $("#gameSuccessBox").data("total", 0) : total<=868 ? ($(".total").text(total + "美金"), $("#gameSuccessBox").data("total", 1)) : toast("联系客服");
                    } else {
                      $(".popMsg > .title").text("报名失败");
                      $(".msgText").text("报名失败，请联系客服");
                      // p===3 && toast("报名失败;联系客服");
                      // $("#gameSuccessBox").data("total", 0);
                    }
                  },
                  function (err) {
                    // toast("請联系客服")
                    //   $(".goService").show();
                  }
                );
              }
            })
            .catch((err) => {
              console.log("err", err);
            });
        }
      }
    });
  };
  $('input[name="account"]').bind("click", function () {
    let loginName = $('input[name="account"]').val();
    if (loginName) {
      initAccount(loginName);
    }
  });
  $(".activity-btn1").click(function () {
    let loginName = $('input[name="account"]').val();
    if (!loginName) {
      $("#login").show();
    } else {
      $("#login").hide();
    }
  });
  //toast
  function toast(content, time) {
    time = time ? time : 3000;
    let html = `<div class="tips_box_1">
      <p>${content}</p>
      <div class="close"></div>
    </div>
      <div class="toast-mask"></div>`;
    $("body").append(html);
    $("html,body").css("overflow", "hide");
    setTimeout(function () {
      $(".tips_box_1").remove();
      $(".toast-mask").remove();
      $("html,body").css("overflow", "auto");
    }, time);
    $(".close").click(function () {
      $(".tips_box_1").remove();
      $(".toast-mask").remove();
      $("html,body").css("overflow", "auto");
    });
  }

