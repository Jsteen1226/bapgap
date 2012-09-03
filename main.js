
function getObject (key) {
	var json = localStorage.getItem(key);
	if(json) {
		return JSON.parse(json);
	}
	return null;
}

function setObject(key, obj) {
	localStorage.setItem(key, JSON.stringify(obj));
}


// 조회
//--Button_1_onclick - start
function Button_1_onclick(e, obj, index) {
	// popup을 띄운다.
	$.pgDatePicker.date = new Date();
	
	$.davinci.popup.open("popup1",{
		pageId: "pgDatePicker",
		modal: true,
		transition: "slideup",
		css: {
			padding: "0px",
			width: "100%",
			height: 185,
			bottom: 0,
			left: 0
		}
	});
}
//--Button_1_onclick - end



//--Button_0_onclick - start
function Button_0_onclick(e, obj, index) {
	// 설정 버튼
	$.davinci.changePage("pgSetting", {changeHash: false});
}
//--Button_0_onclick - end

	


//pgSetting의 OK 버튼	
//--Button_2_onclick - start
function Button_2_onclick(e, obj, index) {
	// 내용을 저장하고...
	
	var settingValue = {};
	
	settingValue.txfBapgap = $.davinci.getTextfield("layvBapgapSetting", "txfBapgap").text(); 
	settingValue.txfEmail = $.davinci.getTextfield("layvEmailSetting", "txfEmail").text();
	settingValue.items = $.davinci.getInstance("lstNameSetting").items();

	setObject("Setting", settingValue);
	
	$.davinci.changePage("pgMain", {changeHash: false});
}
//--Button_2_onclick - end

	


// pgSetting의 CANCEL 버튼
//--Button_3_onclick - start
function Button_3_onclick(e, obj, index) {
	$.davinci.changePage("pgMain", {changeHash: false});
}
//--Button_3_onclick - end


function pgInputSetName() {
	var txfName = $.davinci.getTextfield("layvNameSetting", "txfName");
	if(txfName.text() == "") return;
	var lstNameSetting = $.davinci.getInstance("lstNameSetting");
	lstNameSetting.add([{"lblName" : txfName.text()}]);
	txfName.text("");
}

//--Textfield_2_onkeyup - start
function Textfield_2_onkeyup(e, obj, value, keycode, index) {
	if(keycode == 13) {
		pgInputSetName();
	}
}
//--Textfield_2_onkeyup - end

// pgSetting의 ADD버튼
//--Button_4_onclick - start
function Button_4_onclick(e, obj, index) {
	pgInputSetName();
}
//--Button_4_onclick - end

	
//--pgSetting_onpageshow - start
function pgSetting_onpageshow(e, obj) {
	var settingValue = getObject("Setting");
	if(settingValue) {
		$.davinci.getTextfield("layvBapgapSetting", "txfBapgap").text(settingValue.txfBapgap); 
		$.davinci.getTextfield("layvEmailSetting", "txfEmail").text(settingValue.txfEmail);
		$.davinci.getInstance("lstNameSetting").items(settingValue.items);
	}
}
//--pgSetting_onpageshow - end




$.pgInput = {};


//--Button_8_onclick - start
function Button_8_onclick(e, obj, index) {
	// 해당 라인을 삭제한다.
	var lstNameSetting = $.davinci.getInstance("lstNameSetting");
	lstNameSetting.remove(index);
}
//--Button_8_onclick - end


//--pgInput_onpageinit - start
function pgInput_onpageinit(e, obj) {
}
//--pgInput_onpageinit - end

//--pgInput_onpagebeforeshow - start
function pgInput_onpagebeforeshow(e, obj) {
	// 입력을 선택한 날짜
	var todayDate = $.pgInput.date;
	var today = todayDate.getFullYear() + "/" + (todayDate.getMonth()+1) + "/" + todayDate.getDate();
	$.davinci.getInstance("hdInput", "lblTodayDate").text(today);

	var todayStorage = getObject("Today" + today);
	if(!todayStorage) {
		todayStorage = {names: []};
		setObject("Today" + today, todayStorage);	
	}
	$.pgInput.today = today;
}
//--pgInput_onpagebeforeshow - end

//--pgInput_onpageshow - start
function pgInput_onpageshow(e, obj) {
	var settingValue = getObject("Setting");
	if(settingValue) {
		var bapgap = parseInt(settingValue.txfBapgap, 10);
		var checkedCount = 0;
		var count = settingValue.items.length;
		var lstNameInput = $.davinci.getInstance("lstNameInput");
		var txfRealMoney = $.davinci.getInstance("txfRealMoney");
		
		var names = settingValue.items;
		lstNameInput.items(names);
		
		// 한번 설정된 거면...
		var todayStorage = getObject("Today" + $.pgInput.today);
		if(todayStorage) {
			for(var i=0;i<count;i++) {
				for(var j=0;j<todayStorage.names.length;j++) {
					if(names[i].lblName == todayStorage.names[j].lblName) {
						lstNameInput.checked(i, true);
						checkedCount++;
					}
				}
			}
			
			txfRealMoney.text(todayStorage.realMoney);
		}
		
		var lblTotal = $.davinci.getLabel("ftInput", "lblTotal");
		lblTotal.text(checkedCount.toString() + "명: " + (bapgap * checkedCount) + "원");
	}
}
//--pgInput_onpageshow - end


//--lstNameInput_onchange - start
function lstNameInput_onchange(e, obj, value, index) {
	var settingValue = getObject("Setting");
	if(settingValue) {
		var bapgap = parseInt(settingValue.txfBapgap, 10);
		var checkedCount = 0;
		var count = settingValue.items.length;
		var lstNameInput = $.davinci.getInstance("lstNameInput");
		
		for(var i=0;i<count;i++) {
			if(lstNameInput.checked(i) == true) {
				checkedCount++;
			}
		} 
		
		var lblTotal = $.davinci.getLabel("ftInput", "lblTotal");
		lblTotal.text(checkedCount.toString() + "명: " + (bapgap * checkedCount) + "원");
	}
}
//--lstNameInput_onchange - end


	
//--btnHOk_onclick - start
function btnHOk_onclick(e, obj, index) {
	var todayStorage = getObject("Today" + $.pgInput.today);
	if(todayStorage) {
		todayStorage.names = [];
		
		var lstNameInput = $.davinci.getInstance("lstNameInput");
		for(var i=0;i<lstNameInput.getCount();i++) {
			if(lstNameInput.checked(i) == true) {
				todayStorage.names.push(lstNameInput.items()[i]);
			}
		}
		
		todayStorage.realMoney = $.davinci.getTextfield("txfRealMoney").text();
		
		setObject("Today" + $.pgInput.today, todayStorage);
		
		
		var daysList = getObject("DaysList");
		if(!daysList) {
			daysList = [];
		}
		
		// find
		for (var i=0;i<daysList.length;i++) {
			if(daysList[i] === ("Today" + $.pgInput.today)) {
				break;
			}
		}
		
		if(i == daysList.length) {
			daysList.push("Today" + $.pgInput.today);
			setObject("DaysList", daysList);
		}
	}
	
	$.davinci.changePage("pgMain", {changeHash: false});
}
//--btnHOk_onclick - end



	
//--btnInput_onclick - start
function btnInput_onclick(e, obj, index) {
	$.pgInput.date = new Date();
	$.davinci.changePage("pgInput", {changeHash: false});
}
//--btnInput_onclick - end

	


	
//--Button_6_onclick - start
function Button_6_onclick(e, obj, index) {
	$.davinci.changePage("pgMain", {changeHash: false});
}
//--Button_6_onclick - end

	

//-----------------------------------------------------------------------
$.pgDatePicker = {
	initVars: function() {
		$.pgDatePicker.pkrYear = $.davinci.getPicker("pkrYear");
		$.pgDatePicker.pkrMonth = $.davinci.getPicker("pkrMonth");
		$.pgDatePicker.pkrDate = $.davinci.getPicker("pkrDate");
	}
};

//--Button_5_onclick - start
function Button_5_onclick(e, obj, index) {
	$.davinci.popup.close("popup1");
}
//--Button_5_onclick - end

//--Button_7_onclick - start
function Button_7_onclick(e, obj, index) {
	// 선택된 날짜를 얻어온다.
	var year = parseInt($.pgDatePicker.pkrYear.selectedItem(), 10);
	var month = parseInt($.pgDatePicker.pkrMonth.selectedItem(), 10);
	var date = parseInt($.pgDatePicker.pkrDate.selectedItem(), 10);
	
	$.pgInput.date = new Date(year, month - 1, date);
	
	$.davinci.popup.close("popup1");
	$.davinci.changePage("pgInput", {changeHash: false});
}
//--Button_7_onclick - end

//--pgDatePicker_onpageinit - start
function pgDatePicker_onpageinit(e, obj) {
	$.pgDatePicker.initVars();
	
	var pkrYear = $.pgDatePicker.pkrYear;
	var strYears = [];
	for(var i=1900;i<2100;i++) {
		strYears.push(i);
	}
	pkrYear.items(strYears);
	
	var pkrMonth = $.pgDatePicker.pkrMonth;
	var strMonths = [];
	for(var i=1;i<=12;i++) {
		strMonths.push(i);
	}
	pkrMonth.items(strMonths);
	
	var pkrDate = $.pgDatePicker.pkrDate;
	var strDates = [];
	for(var i=1;i<=31;i++) {
		strDates.push("<li>" + i + "</li>");
	}
	pkrDate.items(strDates.join(""));
}
//--pgDatePicker_onpageinit - end

//--pgDatePicker_onpageshow - start
function pgDatePicker_onpageshow(e, obj) {
	var todayDate = $.pgDatePicker.date;

	$.pgDatePicker.pkrYear.setIndex(todayDate.getFullYear() - 1900);
	$.pgDatePicker.pkrMonth.setIndex(todayDate.getMonth()+1 - 1);
	$.pgDatePicker.pkrDate.setIndex(todayDate.getDate() - 1);
}
//--pgDatePicker_onpageshow - end



function pkrYear_onchange(e, obj, index) {
	adjustEndDate();
}

function pkrMonth_onchange(e, obj, index) {
	adjustEndDate();
}

function pkrDate_onchange(e, obj, index) {
	adjustEndDate();
}

function adjustEndDate() {
	var year = parseInt($.pgDatePicker.pkrYear.selectedItem(), 10);
	var month = $.pgDatePicker.pkrMonth.getIndex();
	var date = parseInt($.pgDatePicker.pkrDate.selectedItem(), 10);
	
	var isLeap = function(year) {
		if ((parseInt(year, 10) % 4) == 0) {
			if (parseInt(year) % 100 == 0) {
				if (parseInt(year, 10) % 400 != 0) {
					return false;
				}
				if (parseInt(year, 10) % 400 == 0) {
					return true;
				}
			}
			
			if (parseInt(year, 10) % 100 != 0) {
				return true;
			}
		}
		
		if ((parseInt(year, 10) % 4) != 0) {
			return false;
		}
	};
	
	var endDates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	// 년과 월을 가지고 마지막 날을 정할 수 있다.
	var endDate = endDates[month];
	if(month == 1 && isLeap(year)) {
		endDate++;
	}

	// 마지막 날짜를 구했으니까...
	// 마지막날짜를 벗어났는 지 검사한다.
	if(endDate < date) {
		$.pgDatePicker.pkrDate.setIndex(endDate - 1);
	}
}



	
//--lstMain_onclick - start
function lstMain_onclick(e, obj, index) {
	var fullDate = obj.items()[index].lblDate.split('/');
	var year = fullDate[0];
	var month = fullDate[1];
	var date = fullDate[2];
	
	$.pgInput.date = new Date(year, month - 1, date);
	
	$.davinci.changePage("pgInput", {changeHash: false});
	
	
}
//--lstMain_onclick - end

	


	
//--pgMain_onpageshow - start
function pgMain_onpageshow(e, obj) {
	
	var daysList = getObject("DaysList");
	if(!daysList) {
		return;
	}

	var items = [];
	for(var i=0;i<daysList.length;i++) {
		var today = daysList[i].slice(5);
		items.push({
			"lblDate" : today
		});
	}
	
	var lstMain = $.davinci.getListitem("lstMain");
	lstMain.items(items);

}
//--pgMain_onpageshow - end

	