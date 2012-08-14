/**
 * Widget의 base class
 * @class dvcInstance
 */
 var dvcInstance = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcInstance['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcInstance['visible'] = function(visible){};
	
	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcInstance['getId'] = function() {};

/**
 * Audio 위젯
 * @augments $.davinci.dvcBase
 * @class dvcAudio
 */
var dvcAudio = new Object();
	
	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcAudio['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcAudio['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcAudio['getId'] = function() {};

	/**
	 * HTMLAudioElement를 반환한다.
	 * @returns {Object} HTMLAudioElement를 반환한다.
	 */
dvcAudio['audio'] = function(){};

	/**
	 * audio를 재생한다.
	 */
dvcAudio['play'] = function(){};

	/**
	 * audio의 재생 상태를 반환한다.
	 * @returns {Boolean} true면 재생 중, false면 정지 상태를 반환한다.
	 */
dvcAudio['isPlaying'] = function(){};

	/**
	 * audio를 정지 한다.
	 */
dvcAudio['pause'] = function(){};

/**
 * Button 위젯
 * @augments $.davinci.dvcBase
 * @class dvcButton
 */
var dvcButton = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcButton['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcButton['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcButton['getId'] = function() {};

	/**
	 * button의 text를 조회 or 설정한다.
	 * @param {String} text undefined면 조회, String이면 button의 text를 설정.
	 * @returns {String} button의 text 문자열을 반환한다.
	 */
dvcButton['text'] = function(text){};

/**
 * Checkbox 위젯
 * @augments $.davinci.dvcButton
 * @class dvcCheckbox
 */
var dvcCheckbox = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcCheckbox['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcCheckbox['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcCheckbox['getId'] = function() {};

	/**
	 * checkbox의 text를 조회 or 설정한다.
	 * @param {String} text undefined면 조회, String이면 checkbox의 text를 설정.
	 * @returns {String} checkbox의 text 문자열을 반환한다.
	 */
dvcCheckbox['text'] = function(text){};

	/**
	 * checkbox의 check상태를 조회 or 설정한다.
	 * @param {Boolean} value undefined면 조회, check하기 위해서는 true, check를 해제하기 위해서는 false로 설정.
	 * @returns {Boolean} checkbox의 check상태(true | false)를 반환한다.
	 */	 
dvcCheckbox['checked'] = function(value){};

	/**
	 * checkbox의 check상태를 toggle 한다.
	 */	 
dvcCheckbox['toggle'] = function(){};

/**
 * Carousel 위젯
 * @augments $.davinci.dvcScrollview
 * @class dvcCarousel
 */
var dvcCarousel = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcCarousel['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcCarousel['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcCarousel['getId'] = function() {};

	/**
	 * 현재 Page의 index를 얻어온다.
	 * @returns {Number} 현재 page index (1부터 시작)
	 */
dvcCarousel['getIndex'] = function(){};

	/**
	 * 현재 페이지를 설정한다.
	 * @param {Number} pageNumber page의 index (1부터 시작)
	 * @param {Number} duration 설정시 이동될 때 slide효과 시간 (mSec 단위)
	 * @param {Boolean | Undefined} skipEvent true면 페이지 설정시 ev-change가 발생하지 않음. (default:false)
	 */
dvcCarousel['setIndex'] = function(pageNumber, duration, skipEvent){};

	/**
	 * Page를 add한다.
	 * @param {String | jQueryObject} html page의 jQuery Object이거나, html 형식의 문자열
	 * @param {Boolean | Undefined} dynamicPage 동적으로 생성된 page를 add할 경우에는 true로 해주어야 함. (default:false)
	 */
dvcCarousel['add'] = function(html, dynamicPage){};

	/**
	 * Page의 총 수를 얻어온다.
	 * @returns {Number} 총 page 수
	 */
dvcCarousel['getCount'] = function(){};

	/**
	 * Carousel에 포함된 모든 page를 제거한다.
	 */
dvcCarousel['clear'] = function(){};

	/**
	 * 모든 page를 Add 후 호출해야한다.
	 * 화면 크기가 변경되었을 때 호출해야 한다.
	 */
dvcCarousel['refresh'] = function(){};

	/**
	 * 다음 페이지로 이동한다.
	 * @param {Boolean} skipEvent ev_change event가 발생 여부 (default:false)
	 */
dvcCarousel['next'] = function(){};

	/**
	 * 이전 페이지로 이동한다.
	 * @param {Boolean} skipEvent ev_change event가 발생 여부 (default:false)
	 */
dvcCarousel['prev'] = function(){};

/**
 * Radio 위젯
 * @augments $.davinci.dvcCheckbox
 * @class dvcRadio
 */
var dvcRadio = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcRadio['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcradio['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcradio['getId'] = function() {};

	/**
	 * radio의 상태를 초기설정으로 바꾼다.
	 */
dvcRadio['refresh'] = function(){};

	/**
	 * radio의 text를 조회 or 설정한다.
	 * @param {String} text undefined면 조회, String이면 radio의 text를 설정.
	 * @returns {String} radio의 text를 반환한다.
	 */
dvcRadio['text'] = function(text){};

	/**
	 * radio의 check상태를 조회 or 설정한다.
	 * @param {Boolean} value undefined면 조회, check하기 위해서는 true, check를 해제하기 위해서는 false로 설정.
	 * @returns {Boolean} radio의 check상태(true | false)를 반환한다..
	 */	
dvcRadio['checked'] = function(value){};

	/**
	 * radio의 check상태를 toggle 한다.
	 */	 
dvcRadio['toggle'] = function(){};

/**
 * 하위의 Element를 접거나 펼칠때 사용하는 위젯
 * @augments $.davinci.dvcBase
 * @class dvcCollapseview
 */
var dvcCollapseview = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcCollapseview['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcCollapseview['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcCollapseview['getId'] = function() {};

	/**
	 * 하위 Element를 접거나 펼친다.
	 * @param {Boolean} c true면 펼치고, false면 접는다.
	 * @param {Number} duration collapseview를 접거나 펼칠 경우 animation 지속시간
	 * @param {Function} complete 펼치거나 접는 동작이 완료된 후에 호출되는 callback
	 */
dvcCollapseview['collapsed'] = function(c, duration, complete){};

/**
 * data binding을 위한 위젯
 * @augments $.davinci.dvcBase
 * @class dvcDataSource
 */
var dvcDataSource = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcDataSource['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcDataSource['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcDataSource['getId'] = function() {};

	/**
	 * Binding 데이터에 대한 Json Object를 조회 or 설정한다.
	 * @param {Object} jsonObjParam undefiend면 조회, binding을 위한 data를 설정
	 * @returns {Object} binding data를 반환한다.
	 */		
dvcDataSource['data'] = function(jsonObjParam){};

	/**
	 * options에 설정된 값을 기준으로 사용자 데이터를 로딩한다.
	 * @param {Function} success 데이터 로딩 성공 시 호출될 콜백 함수, Widget Instance를 이용하여 직접 호출할 경우 콜백을 지정해야한다.<br/><br/>
	 *                   success 함수의 Prototype은 다음과 같다.<br/>
	 * @example <b>1) success 함수 Prototype</b>
	 * function success &#40JSONObject result&#41 &#123
	 *     result &#61 &#123
	 *         result &#58 string,
	 *         datasource &#58 object,
	 *         data &#58 JSONObject
	 *     &#125
	 * &#125
	 * @param {Function} error 데이터 로딩 실패 시 호출될 콜백 함수, Widget Instance를 이용하여 직접 호출할 경우 콜백을 지정해야한다.<br/><br/>
	 *                   error 함수의 Prototype은 다음과 같다.<br/>
	 * @example <b>2) error 함수 Prototype</b>
	 * function error &#40JSONObject result&#41 &#123
	 *     result &#61 &#123
	 *         result &#58 string,
	 *         datasource &#58 object,
	 *         data &#58 null,
	 *         error &#58 &#123
	 *             name &#58 string,
	 *             message &#58 string,
	 *             xhr &#58 XMLHttpRequest Object,
	 *             thrownError &#58 jQuery thrown object
	 *         &#125
	 *     &#125
	 * &#125
	 */
dvcDataSource['load'] = function(success, error){};

	/**
	 * options의 value에 설정된 값을 storage에 저장한다.<br/>
	 * 만약 options의 proxy 값이 localStorage/sessionStorage가 아닐 경우<br/>
	 * DataSource의 jsonObject에 저장된다.
	 */
dvcDataSource['store'] = function(){};

/**
 * Division 위젯
 * @augments $.davinci.widget
 * @class dvcDivision
 */
var dvcDivision = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcDivision['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcDivision['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcDivision['getId'] = function() {};

	/**
	 * Html을 설정한다.
	 * @param {String} value html을 설정
	 */
dvcDivision['html'] = function(value) {};

	/**
	 * Division에 포함된 내용을 모두 제거한다.
	 */
dvcDivision['clear'] = function() {};

/**
 * page의 하단에 위치하는 위젯
 * @augments $.davinci.dvcBase
 * @class dvcFooter
 */																																								
var dvcFooter = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcFooter['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcFooter['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcFooter['getId'] = function() {};

	/**
	 * dvcFooter의 height가 변경된 경우 호출해야 한다.
	 */
dvcFooter['refresh'] = function(){};

/**
 * 수평 분할을 위한 위젯
 * @augments $.davinci.dvcBase
 * @class dvcGrid
 */
var dvcGrid = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcGrid['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcGrid['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcGrid['getId'] = function() {};

	/**
	* grid의 분할 상태를 초기 상태로 바꾼다.
	*/
dvcGrid['refresh'] = function(){};

/**
 * page의 상단에 위치하는 위젯
 * @augments $.davinci.dvcBase
 * @class dvcHeader
 */
var dvcHeader = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcHeader['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcHeader['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcHeader['getId'] = function() {};

	/**
	 * dvcFooter의 height가 변경된 경우 호출해야 한다.
	 */
dvcHeader['refresh'] = function(){};

/**
 * 그림을 표시하기 위한 위젯
 * @augments $.davinci.dvcBase
 * @class dvcImage
 */
var dvcImage = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcImage['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcImage['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcImage['getId'] = function() {};

	/**
	 * image의 상태를 초기설정으로 바꾼다.
	 */
dvcImage['refresh'] = function(){};

	/**
	 * imagebutton의 text를 ㅊ한다.
	 * @param {String} text undefined면 조회, String이면 button을 text를 설정.
	 * @returns {String} imagebutton의 text 문자열을 반환한다.
	 */
dvcImage['src'] = function(url){};

	/**
	 * image의 type을 설정한다.
	 * @param {String} type "stretch" | "zoom" | "center" | "tile" | "normal"
	 */
dvcImage['type'] = function(type){};

/**
 * ImageButton 위젯
 * @augments $.davinci.dvcBase
 * @class dvcImageButton
 */
var dvcImageButton = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcImageButton['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcImageButton['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcImageButton['getId'] = function() {};

	/**
	 * dvcImageButton 상태를 초기설정으로 바꾼다.
	 */
dvcImageButton['refresh'] = function(){};

	/**
	 * imagebutton의 text를 ㅊ한다.
	 * @param {String} text undefined면 조회, String이면 button을 text를 설정.
	 * @returns {String} imagebutton의 text 문자열을 반환한다.
	 */
dvcImageButton['text'] = function(text){};

	/**
	 * image의 type을 설정한다.
	 * @param {String} type "stretch" | "zoom" | "center" | "tile" | "normal"
	 */
dvcImageButton['type'] = function(type){};

/**
 * Label 위젯
 * @augments $.davinci.dvcBase
 * @class dvcLabel 
 */
var dvcLabel = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcLabel['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcLabel['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcLabel['getId'] = function() {};

	/**
	 * label의 text align을 조회 or 설정한다.
	 * @param {String} textalign undefined면 조회, String이면 label의 text align을  "center" | "left" | "right"로 설정
	 * @return {String} "center" | "left" | "right" 반환한다.
	 */
dvcLabel['textAlign'] = function(textalign){};

	/**
	 * label의 text를 조회 or 설정한다.
	 * @param {String} text undefined면 조회, String이면 label을 text를 설정.
	 * @returns {String} 문자열을 반환한다.
	 */
dvcLabel['text'] = function(text){};

/**
 * basic widget을 배치하기 위한 위젯
 * @augments $.davinci.dvcBase
 * @class dvcLayoutview
 */
var dvcLayoutview = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcLayoutview['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcLayoutview['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcLayoutview['getId'] = function() {};
	
	/**
	 * layoutview의 상태를 초기설정으로 바꾼다.
	 */
dvcLayoutview['refresh'] = function(){};

	/**
	 * layoutview의 check상태를 toggle 한다.
	 */	 
dvcLayoutview['toggle'] = function(){};
	
	/**
	 * layoutview의 check상태를 조회 or 설정한다.
	 * @param {Boolean} isChecked undefined면 조회, check하기 위해서는 true, check를 해제하기 위해서는 false로 설정.
	 * @returns {Boolean} layoutview의 check상태(true | false)를 return한다.
	 */	 
dvcLayoutview['checked'] = function(isChecked){};

/**
 * basic widget을 list형태로 배치하기 위한 위젯
 * @augments $.davinci.dvcBase
 * @class dvcListitem
 */
var dvcListitem = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcListitem['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcListitem['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcListitem['getId'] = function() {};
	
	/**
	 * Listitem의 item을 추가한다.
	 * @param {Array|String} items 추가할 item 배열, 사용자 정의시에는 String을 사용한다.
	 * @param {Number} index 추가할 item이 삽입될 위치, undefined일 경우에는 마지막에 추가된다.
	 * @example
	 * 추가되는 라인마다 userData를 설정하기 위해서는 예약된 subid인 "userData"를 사용한다.
	 * 
	 * var items = [];
	 * for&#40;var i &#061; 0; i &lt; 10; i&#43;&#43; &#41; { 
	 *     items.push&#40;{
	 *         label1: "item " &#43; i,
     *         userData: {	// 라인마다 필요한 data를 object형태로 저장한다.
     *             index : i &#42; 2
     *         }
     *    }&#41;;
     * }
     *
     * 해당 라인의 userData를 읽어오기 위해서는 userData()를 호출한다.
	 */
dvcListitem['add'] = function(items, index){};
	
	/**
	 * Listitem의 item을 변경한다.
	 * @param {Array} items 변경할 item 배열
	 * @param {Number} index 변경할 item의 시작 index
	 */
dvcListitem['update'] = function(items, index){};
	
	/**
	 * Listitem의 item을 제거한다.
	 * @param {Number} index 제거할 item의 index
	 */
dvcListitem['remove'] = function(index){};

	/**
	 * Listitem의 item을 모두 제거한다.
	 */
dvcListitem['clear'] = function(){};

	/**
	 * Listitem의 item을 조회 or 설정한다.
	 * addItems과 다르게 모든 item을 지운 상태에서 설정하게 된다.
	 * @param {Array|String} items undefined면 조회, items 추가할 item 배열, 사용자 정의시에는 String을 사용한다.
	 * @returns {Array|String} Listitem의 item을 반환한다.
	 */
dvcListitem['items'] = function(items){};
	
	/**
	 * Listitem의 모든 item의 개수를 얻어온다.
	 */
dvcListitem['getCount'] = function(){};
	
	/**
	 * Listitem의 enable상태를 조회 or 설정한다.
	 * @param {Number} lineIndex Listitem의 lineIndex, -1일 경우에는 전체listitem에 해당한다.
	 * @param {Boolean} e undefined면 조회, enable하기 위해서는 true, disable를 하기 위해서는 false로 설정.
	 * @returns {Boolean} Listitem의 enable상태(true | false)를 반환한다.
	 */	 
dvcListitem['enable'] = function(lineIndex, e){};
	
	/**
	 * Listitem의 check상태를 조회 or 설정한다.
	 * @param {Number} lineIndex Listitem의 lineIndex
	 * @param {Boolean} v undefined면 조회, check하기 위해서는 true, check를 해제하기 위해서는 false로 설정.
	 * @returns {Boolean} Listitem의 check상태(true | false)를 반환한다.
	 */	 
dvcListitem['checked'] = function(lineIndex, v){};
	
	/**
	 * Listitem의 한 item에 대해 정보를 조회 or 설정한다.
	 * @param {Number} lineIndex Listitem의 lineIndex
	 * @param {Object} d undefined면 조회, 저장할 정보를 설정.
	 * @returns {Boolean} Listitem의 해당라인의 정보를 반환한다.
	 */	 
dvcListitem['userData'] = function(lineIndex, d){};

/**
 * page를 담을 수 있는 위젯
 * @augments $.davinci.dvcBase
 * @class dvcPagebox
 */
var dvcPageBox = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcPageBox['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcPageBox['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcPageBox['getId'] = function() {};

	/**
	 * pagebox의 페이지를 전환 한다.
	 * @param {String} _pageid 전환 할 page의 pageid
	 * @param {Object} options
	 *		<dl class="detailList">
	 *		<dt><span class="light fixedFont">{String}</span> <b>transition</b></dt><dd>: 전환 효과 "none" | "slide" | "slideup" | "slidedown" | "fade" | "pop" | "flip" (default:"none")</dd>
	 *		<dt><span class="light fixedFont">{Boolean}</span> <b>reverse</b></dt><dd>: true면 전환 효과의 반대, false면 전환 효과를 그대로 적용한다. (default:false)</dd>
	 *		<dt><span class="light fixedFont">{String}</span> <b>role</b></dt><dd>: By default we rely on the role defined by the @data-role attribute. </dd>
	 *		<dt><span class="light fixedFont">{Boolean}</span> <b>showLoadMsg</b></dt><dd>: loading message shows by default when pages are being fetched during changePage</dd>
	 *		<dt><span class="light fixedFont">{String}</span> <b>fromPage</b></dt><dd>: 이미 보여지고 있었던 페이지의 pageid (default:undefined)</dd>
	 *		<dt><span class="light fixedFont">{Boolean}</span> <b>allowSamePageTransition</b></dt><dd>: 같은 페이지로의 전환을 허용하는지의 여부 (default:false)</dd>
	 *		</dl>
	 */	 
dvcPageBox['changePage'] = function(_pageid, options){};

	/**
	 *	pagebox의 activepage를 반환한다.
	 *	@returns {String} activepage의 page object
	 */
dvcPageBox['getActivePage'] = function(){};

/**
 * 여러 item중 하나를 선택하기 위한 위젯
 * @augments $.davinci.dvcScrollview
 * @class dvcPicker
 */
var dvcPicker = new Object();
	
	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcPicker['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcPicker['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcPicker['getId'] = function() {};

	/**
	 * picker에 item을 추가한다.
	 * @param {String} html picker에 표시될 item을 추가한다. item하나가 <li></li>로 쌓여있어야 한다.
	 */
dvcPicker['add'] = function(html){};

	/**
	 * picker에 item을 모두 제거한다.
	 */
	this.clear = function() {};
dvcPicker['clear'] = function(){};

	/**
	 * picker에 모든 item의 개수를 조회한다.
	 * @returns {Number} 전체 item의 수
	 */
dvcPicker['getCount'] = function(){};

	/**
	 * picker의 선택된 index를 조회한다.
	 * @returns {Number} 선택된 index값
	 */
dvcPicker['getIndex'] = function(){};

	/**
	 * 해당되는 index로 이동한다.
	 * @param {Number} index 이동할 index
	 */
dvcPicker['setIndex'] = function(index){};

/**
 * Progress 위젯
 * @augments $.davinci.dvcBase
 * @class dvcProgress 위젯
 */
var dvcProgress = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcProgress['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcProgress['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcProgress['getId'] = function() {};
	
	/**
	 * progress의 상태를 초기설정으로 바꾼다.
	 */
dvcProgress['refresh'] = function(){};

	/**
	 * progress의 min값을 설정한다.
	 * @param {Number} min Number이면 현재 progress의 min 값을 설정.
	 */
dvcProgress['min'] = function(min){};

	/**
	 * progress의 max 값을 설정한다.
	 * @param {Number} max Number이면 현재 progress의 max 값을 설정.
	 */
dvcProgress['max'] = function(max){};
	
	/**
	 * progress의 value를 조회 or 설정한다.
	 * @param {Number} percent undefined면 조회, Number이면 현재 progress의 위치를 설정.
	 * @returns {Number} 현재 progress의 위치를 반환한다.
	 */
dvcProgress['value'] = function(percent){};

/**
 * Scroll 위젯 (Scroll 하위의 view 위젯은 position:relative가 전제)
 * @augments $.davinci.dvcBase
 * @class dvcScrollview
 */
var dvcScrollview = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcScrollview['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcScrollview['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcScrollview['getId'] = function() {};
	
	/**
	 * scrollview의 위치를 이동한다.
	 * @param {Number} x scrollview의 x 위치
	 * @param {Number} y scrollview의 y 위치
	 * @param {Number} Animation 효과 시간(mSec)으로, 값이 있을 경우에는 x, y값을 (+)양수로 표시
	 *                 Undefined 또는 0으로 Animation 없을 경우에는 x, y값을 (-)음수로 표시
	 */
dvcScrollview['scrollTo'] = function(x, y, Animation){};
	
	/**
	 * scrollview의 상한 값를 얻어온다.
	 * @returns {Object} {x, y}의 값을 얻어온다.
	 */
dvcScrollview['getScrollMax'] = function(){};

	/**
	 * scrollview의 위치를 얻어온다.
	 * @returns {Object} {x, y}의 값을 얻어온다.
	 */
dvcScrollview['getScrollPosition'] = function(){};

/**
 * Slider 위젯
 * @augments $.davinci.dvcBase
 * @class dvcSlider
 */
var dvcSlider = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcSlider['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcSlider['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcSlider['getId'] = function() {};

	/**
	 * progress의 상태를 초기설정으로 바꾼다.
	 */
dvcSlider['refresh'] = function(){};

	/**
	 * progress의 min값을 설정한다.
	 * @param {Number} min Number이면 현재 progress의 min 값을 설정.
	 */
dvcSlider['min'] = function(min){};

	/**
	 * progress의 max 값을 설정한다.
	 * @param {Number} max Number이면 현재 progress의 max 값을 설정.
	 */
dvcSlider['max'] = function(max){};
	
	/**
	 * progress의 value를 조회 or 설정한다.
	 * @param {Number} percent undefined면 조회, Number이면 현재 progress의 위치를 설정.
	 * @returns {Number} 현재 progress의 위치를 반환한다.
	 */
dvcSlider['value'] = function(percent){};

/**
 * Switch 위젯
 * @augments $.davinci.dvcBase
 * @class dvcSwitch
 */
var dvcSwitch = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcSwitch['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcSwitch['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcSwitch['getId'] = function() {};

	/**
	 * switch의 check상태를 조회 or 설정한다.
	 * @param {Boolean} value undefined면 조회, check하기 위해서는 true, check를 해제하기 위해서는 false로 설정.
	 * @returns {Boolean} switch의 check상태(true | false)를 반환한다.
	 */
dvcSwitch['checked'] = function(value){};

/**
 * Textarea 위젯
 * @augments $.davinci.dvcBase
 * @class dvcTextarea
 */
var dvcTextarea = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcTextarea['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcTextarea['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcTextarea['getId'] = function() {};

	/**
	 * textarea의 text를 조회 or 설정한다.
	 * @param {String} text undefined면 조회, String이면 textarea의 text를 설정.
	 * @returns {String} textarea의 text 문자열을 반환한다.
	 */
dvcTextarea['text'] = function(text){};

/**
 * Textfield 위젯
 * @augments $.davinci.dvcBase
 * @class dvcTextfield
 */
var dvcTextfield = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcTextfield['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcTextfield['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcTextfield['getId'] = function() {};
		
	/**
	 * textfield의 focus를 위치시킨다.
	 */
dvcTextfield['focus'] = function(){};

	/**
	 * textfield의 text를 조회 or 설정한다.
	 * @param {String} text undefined면 조회, String이면 button을 text를 설정.
	 * @returns {String} textfield의 text 문자열을 반환한다.
	 */
dvcTextfield['text'] = function(text){};

/**
 * Treeview 위젯
 * @augments $.davinci.dvcBase
 * @class dvcTreeview 위젯
 */
var dvcTreeview = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcTreeview['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcTreeview['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcTreeview['getId'] = function() {};
	
	/**
	 * treeview의 node를 추가한 후 그린다.
	 * @param {Array} _datas 추가할 node data
	 */	
dvcTreeview['drawTreeview'] = function(_datas){};

	/**
	 * 해당 target node에 node를 추가한 후 그린다.
	 * @param {Object} target target node
	 * @param {Array} data 추가할 노드의 data
	 * @param {String} type target node의 전에 추가할 경우 "before"(default), 아니면 "after"
	 */	
dvcTreeview['addNode'] = function(target, data, type){};

	/**
	 * target node를 제거한다.
	 * @param {Object} target 제거할 target node
	 * @param {Boolean} isunwrap 삭제할 node의 자식들을 상위 node에게 전달할 경우 true, 아니면 false(default)
	 */
dvcTreeview['removeNode'] = function(target, isunwrap){};
	
	/**
	 * 모든 node 삭제한다
	 */	
dvcTreeview['removeAll'] = function(){};
	
	/**
	 * 현재 선택된 node를 type에 맞게 반환한다
	 * @param {String} type 현재 선택된 node의 id반환 |"path": 현재 선택된 node의 path 반환 |생략(default): 현재 선택된 노드 반환
	 * @returns {Object|String|Number} 타입에 맞게 선택된 node 정보 반환(선택된 node 없을 경우 -1)
	 */	
dvcTreeview['getSelectedNode'] = function(type){};
	
	/**
	 * 현재 체크박스에 체크된 node를 type에 맞게 반환한다
	 * @param {String} type 현재 선택된 node의 data반환 |생략(default): 현재 선택된 node 반환	 
	 * @returns {Object|String} 타입에 맞게 체크된 node 정보 반환(체크된 node 없을 경우 null)
	 */	
dvcTreeview['getCheckedNodes'] = function(type){};
	
	/**
	 * 해당 path의 node data 반환한다
	 * @param {String} path 반환하려는 data를 가진 node의 path	 
	 * @returns {Array} 해당 path의 node data 반환(해당 node data가 없을 경우 node의 전체 data 반환)
	 */
dvcTreeview['getItems'] = function(path){};

/**
 * Video 위젯
 * @augments $.davinci.dvcBase
 * @class dvcVideo
 */
var dvcVideo = new Object();

	/**
	 * widget의 enable상태를 조회 or 설정한다.
	 * @param {Boolean} enable undefined면 enable상태를 조회, true면 enable, false면 disable
	 * @returns {Boolean} enable상태이면 true, disable상태이면 false
	 */
dvcVideo['enable'] = function(enable){};

	/**
	 * widget의 visible상태를 조회 or 설정한다.
	 * @param {Boolean} visible undefined면 visible상태를 조회, true면 visible, false면 invisible
	 * @returns {Boolean} visible상태이면 true, invisible상태이면 false
	 */
dvcVideo['visible'] = function(visible){};

	/**
	 * widget의 id or subid를 조회한다.
	 * @returns {Boolean} widget의 id or subid
	 */
dvcVideo['getId'] = function() {};
	
	/**
	 * HTMLVideoElement를 반환한다..
	 * @returns {Object} HTMLVideoElement를 반환한다.
	 */
dvcVideo['video'] = function(){};

	/**
	 * video를 재생한다.
	 */
dvcVideo['play'] = function(){};
	
	/**
	 * video의 재생 상태를 반환한다.
	 * @returns {Boolean} true면 재생 중, false면 정지 상태를 반환한다.
	 */
dvcVideo['isPlaying'] = function() {};

	/**
	 * video를 정지 한다.
	 */
dvcVideo['pause'] = function() {};


var $ = {
		/**     
			@class UI framework에서 사용하는 static API
		*/
		davinci: {
			/**
			 * 페이지를 전환 한다.
			 * 
			 * @param {String} to 전환 할 page의 id
			 * @param {Object} options
			 *		<dl class="detailList">
			 *		<dt><span class="light fixedFont">{String}</span> <b>transition</b></dt><dd>: 전환 효과 "none" | "slide" | "slideup" | "slidedown" | "fade" | "pop" | "flip" (Android경우 "none"으로 설정)</dd>
			 *		<dt><span class="light fixedFont">{Boolean}</span> <b>reverse</b></dt><dd>: true면 전환 효과의 반대, false면 전환 효과를 그대로 적용한다.</dd>
			 *		<dt><span class="light fixedFont">{Boolean}</span> <b>changeHash</b></dt><dd>: true</dd>
			 *		<dt><span class="light fixedFont">{Boolean}</span> <b>fromHashChange</b></dt><dd>: false</dd>
			 *		<dt><span class="light fixedFont">{String}</span> <b>role</b></dt><dd>: By default we rely on the role defined by the @data-role attribute.</dd>
			 *		<dt><span class="light fixedFont">{Undefined}</span> <b>duplicateCachedPage</b></dt><dd>: undefined</dd>
			 *		<dt><span class="light fixedFont">{Undefined}</span> <b>pageContainer</b></dt><dd>: undefined</dd>
			 *		<dt><span class="light fixedFont">{Boolean}</span> <b>showLoadMsg</b></dt><dd>: loading message shows by default when pages are being fetched during changePage</dd>
			 *		<dt><span class="light fixedFont">{Undefined}</span> <b>dataUrl</b></dt><dd>: undefined</dd>
			 *		<dt><span class="light fixedFont">{String}</span> <b>fromPage</b></dt><dd>: 이미 보여지고 있었던 페이지의 pageid</dd>
			 *		<dt><span class="light fixedFont">{Boolean}</span> <b>allowSamePageTransition</b></dt><dd>: 같은 페이지로의 전환을 허용하는지의 여부</dd>
			 *		</dl>
			 */
			changePage: function(to, options) {},
			
			/**
			 * Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다. (생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcInstance} Widget의 instance
			 */
			getInstance : function (id, subid, lineIndex) {
				return dvcInstance;
			},
			
			/**
			 * dvcAudio Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcAudio} dvcAudio Widget의 instance
			 */
			getAudio : function (id, subid, lineIndex) {
				return dvcAudio;
			},
		
			/**
			 * dvcButton Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcButton} dvcButton Widget의 instance
			 */
			getButton : function (id, subid, lineIndex) {
				return dvcButton;
			},
		
			/**
			 * dvcCarousel Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcCarousel} dvcCarousel Widget의 instance
			 */
			getCarousel : function (id, subid, lineIndex) {
				return dvcCarousel;
			},
			
			/**
			 * dvcCarouselIndicator Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcCarouselIndicator} dvcCarouselIndicator Widget의 instance
			 */
			getCarouselIndicator : function (id, subid, lineIndex) {
				return dvcCarouselIndicator;
			},
		
			/**
			 * dvcCollapseview Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcCollapseview} dvcCollapseview Widget의 instance
			 */
			getCollapseview : function (id, subid, lineIndex) {
				return dvcCollapseview;
			},
			/**
			 * dvcContent Widget의 instance를 가져온다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 Container Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcContent} dvcContent Widget의 instance
			 */			
			getContent : function (id, subid, lineIndex) {
				return dvcContent;
			},
			
			/**
			 * dvcDataSource Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcDataSource} dvcDataSource Widget의 instance
			 */
			getDataSource : function (id, subid, lineIndex) {
				return dvcDataSource;
			},
			
			/**
			 * dvcDivision Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcDivision} dvcDivision Widget의 instance
			 */
			getDivision : function (id, subid, lineIndex) {
				return dvcDivision;
			},
		
			/**
			 * dvcFooter Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcFooter} dvcFooter Widget의 instance
			 */
			getFooter : function (id, subid, lineIndex) {
				return dvcFooter;
			},
		
			/**
			 * dvcGrid Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcGrid} dvcGrid Widget의 instance
			 */
			getGrid : function (id, subid, lineIndex) {
				return dvcGrid; 
			},
		
			/**
			 * dvcHeader Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcHeader} dvcHeader Widget의 instance
			 */
			getHeader : function (id, subid, lineIndex) {
				return dvcHeader;
			},
		
			/**
			 * dvcImage Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcImage} dvcImage Widget의 instance
			 */
			getImage : function (id, subid, lineIndex) {
				return dvcImage;
			},
		
			/**
			 * dvcImageButton Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcImageButton} dvcImageButton Widget의 instance
			 */
			getImageButton : function (id, subid, lineIndex) {
				return dvcImageButton;
			},
		
			/**
			 * dvcLabel Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcLabel} dvcLabel Widget의 instance
			 */
			getLabel : function (id, subid, lineIndex) {
				return dvcLabel;
			},
		
			/**
			 * dvcLayoutview Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcLayoutview} dvcLayoutview Widget의 instance
			 */
			getLayoutview : function (id, subid, lineIndex) {
				return dvcLayoutview;
			},
		
			/**
			 * dvcListitem Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcListitem} dvcListitem Widget의 instance
			 */
			getListitem : function (id, subid, lineIndex) {
				return dvcListitem;
			},
		
			/**
			 * dvcPageBox Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcPageBox} dvcPageBox Widget의 instance
			 */
			getPageBox : function (id, subid, lineIndex) {
				return dvcPageBox;
			},
		
			/**
			 * dvcPicker Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcPicker} dvcPicker Widget의 instance
			 */
			getPicker : function (id, subid, lineIndex) {
				return dvcPicker;
			},
			
			/**
			 * dvcProgress Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcProgress} dvcProgress Widget의 instance
			 */
			getProgress : function (id, subid, lineIndex) {
				return dvcProgress;
			},
		
			/**
			 * dvcScrollview Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcScrollview} dvcScrollview Widget의 instance
			 */
			getScrollview : function (id, subid, lineIndex) {
				return dvcScrollview;
			},
		
			/**
			 * dvcSlider Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {dvcSlider} dvcSlider Widget의 instance
			 */
			getSlider : function (id, subid, lineIndex) {
				return dvcSlider;
			},
		
			/**
			 * dvcSwitch Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcSwitch} dvcSwitch Widget의 instance
			 */
			getSwitch : function (id, subid, lineIndex) {
				return dvcSwitch;
			},
		
			/**
			 * dvcTextarea Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcTextarea} dvcTextarea Widget의 instance
			 */
			getTextarea : function (id, subid, lineIndex) {
				return dvcTextarea;
			},
		
			/**
			 * dvcTextfield Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcTextfield} dvcTextfield Widget의 instance
			 */
			getTextfield : function (id, subid, lineIndex) {
				return dvcTextfield;
			},
		
			/**
			 * dvcTreeview Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcTreeview} dvcTreeview Widget의 instance
			 */
			getTreeview : function (id, subid, lineIndex) {
				return dvcTreeview;
			},
		
			/**
			 * dvcVideo Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcVideo} dvcVideo Widget의 instance
			 */
			getVideo : function (id, subid, lineIndex) {
				return dvcVideo;
			},
			
			/**
			 * dvcCheckbox Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcCheckbox} dvcCheckbox Widget의 instance
			 */
			getCheckbox : function (id, subid, lineIndex) {
				return dvcCheckbox;
			},
		
			/**
			 * dvcRadio Widget의 instance를 반환한다.
			 * 
			 * @param {String} id : id 값을 넣는다. Basic Widget의 경우는 자신의 부모 중 가장 가까이에 있는 View Widget의 id를 넣는다.
			 * @param {String|undefined} subid : Basic Widget의 경우 사용 한다. 자신의 subid를 넣는다.(생략가능)
			 * @param {Number|undefined} lineIndex : Listitem의 경우 사용 한다. Listitem의 lineIndex를 넣는다. (생략가능)
			 * @return {dvcRadio} dvcRadio Widget의 instance
			 */
			getRadio : function (id, subid, lineIndex) {
				return dvcRadio;
			},
			
			/**
			 * body의 child인 page중에서 현재 활성화된 page를 반환한다.
			 * 
			 * @returns {String} page id
			 */
			getActivePage: function() {},
			
			/**
			 * OS의 name을 조회한다.
			 * @return {String} "Android" | "iOS" | "Other" 중 하나를 반환한다.
			 */
			getOSName : function() {
			},
			
			/**
			 * OS의 version을 조회한다.
			 * @return {String} OS의 version을 반환한다.
			 */
			getOSVersion : function() {
			},
			
			/**
			 * device의 type을 조회한다.
			 * @return {String} "Phone" | "Tablet" | "Desktop" 중 하나를 반환한다.
			 */
			getDeviceType : function() {
			},
			
						
			/**
			 * 상위 element의 테마를 가져온다.
			 * 가장 가까운 element를 검색하고, 없을 경우 "a" 테마를 반환한다.
			 * 
			 * @param {Object} 해당 widget의 jQuery Object
			 * @param {String} defaultTheme
			 * @returns {String} Theme명
			 */			 
			getInheritedTheme : function (el, defaultTheme) {
			},			
			
			/**     
			@class popup에 대한 static API
			*/
			popup : {
				
				/**
				 * popup을 open한다.
				 *
				 * @param {String} id	popup에 사용할 id
				 * @param {Object} options
				 *		<dl class="detailList">
				 *		<dt><span class="light fixedFont">{String}</span> <b>pageid</b></dt><dd>: popup내에 포함할 page의 id</dd>
				 *		<dt><span class="light fixedFont">{Object}</span> <b>css</b></dt><dd>: popup의 css로 position과 dimension 등을 기입할 때 사용</dd>
				 *		<dt><span class="light fixedFont">{Boolean}</span> <b>modal</b></dt><dd>: true면 modal popup, false면 modaless popup, (default:false)</dd>
				 *		<dt><span class="light fixedFont">{String}</span> <b>transition</b></dt><dd>: 전환 효과 "none" | "slide" | "slideup" | "slidedown" | "fade" | "pop" | "flip", (default:"pop")</dd>
				 *		<dt><span class="light fixedFont">{Number}</span> <b>overlay</b></dt><dd>: 투명도(0 ~ 100) 0이 가장 투명하고, 100이 가장 불투명하다. (default:0)</dd>
				 *		<dt><span class="light fixedFont">{Function}</span> <b>onbeforeshow</b></dt><dd>: popup이 show되기 전에 호출될 callback function</dd>
				 *		<dt><span class="light fixedFont">{Function}</span> <b>onshow</b></dt><dd>: popup이 show된 후에 호출될 callback function</dd>
				 *		<dt><span class="light fixedFont">{Function}</span> <b>onbeforehide</b></dt><dd>: popup이 hide되기 전에 호출될 callback function</dd>
				 *		<dt><span class="light fixedFont">{Function}</span> <b>onhide</b></dt><dd>: popup이 hide된 후에 호출될 callback function</dd>
				 *		</dl>
				 * @return {Object} 생성한 popup의 instance
				 */
				open: function(id, options) {},
				/**
				 * popup을 close한다.
				 *
				 * @param {String} id	close할 popup의 id
				 */
				close: function(id) {},
				/**
				 * popup의 show 여부를 확인한다.
				 *
				 * @param {String} id	show 되었는지 확인할 popup의 id 
				 * @return {Boolean}	popup이 show되었으면 true, 아니면 false
				 */
				isShown: function(id) {},
				/**
				 * anchor를 붙이기 위해 popup의 position을 보정한다.
				 *
				 * @param {Object} $el	popup의 jQuery Object ( $("popupid") )
				 * @param {Number} popupLeft	popup의 left
				 * @param {Number} popupWidth	popup의 Width
				 * @param {Number} popupHeight	popup의 popupHeight
				 * @param {String} popupType	"top" | "bottom"
				 * @return {Object}	보정된 좌표 {left, top, width, height, anchorPos, type }
				*/
				adjustPopupPos: function($el, popupLeft, popupWidth, popupHeight, popupType) {},
				/**
				 * popup의 left와 anchor의 위치를 변경한다.
				 *
				 * @param {String} id	위치를 변경할 popup의 id
				 * @param {Object} PopupPos	이동할 좌표 {left, top, width, height, anchorPos }
				*/
				reposition: function(id, PopupPos) {}
				
			}
		}
};