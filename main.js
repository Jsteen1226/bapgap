


	
//--Button_1_onclick - start
function Button_1_onclick(e, obj, index) {

}
//--Button_1_onclick - end

	


	
//--pgMain_onpageinit - start
function pgMain_onpageinit(e, obj) {

}
//--pgMain_onpageinit - end

	


	
//--pgMain_onpageshow - start
function pgMain_onpageshow(e, obj) {

}
//--pgMain_onpageshow - end

	


	
//--Button_0_onclick - start
function Button_0_onclick(e, obj, index) {
	// 설정 버튼
	$.davinci.changePage("pgSetting");
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

	localStorage.setItem("Setting", JSON.stringify(settingValue));
	
	$.davinci.changePage("pgMain");
}
//--Button_2_onclick - end

	


// pgSetting의 CANCEL 버튼
//--Button_3_onclick - start
function Button_3_onclick(e, obj, index) {
	$.davinci.changePage("pgMain");
}
//--Button_3_onclick - end

	


// pgSetting의 ADD버튼
//--Button_4_onclick - start
function Button_4_onclick(e, obj, index) {
	var txfName = $.davinci.getTextfield("layvNameSetting", "txfName");
	var lstNameSetting = $.davinci.getInstance("lstNameSetting");
	lstNameSetting.add([{"lblName" : txfName.text()}]);
	txfName.text("");
}
//--Button_4_onclick - end

	
//--pgSetting_onpageshow - start
function pgSetting_onpageshow(e, obj) {
	var settingValue = localStorage.getItem("Setting");
	if(settingValue) {
		settingValue = JSON.parse(settingValue);
		
		$.davinci.getTextfield("layvBapgapSetting", "txfBapgap").text(settingValue.txfBapgap); 
		$.davinci.getTextfield("layvEmailSetting", "txfEmail").text(settingValue.txfEmail);
		$.davinci.getInstance("lstNameSetting").items(settingValue.items);		
	}
}
//--pgSetting_onpageshow - end

	