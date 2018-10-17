export default {
	addCookie(key, value, expiresDays){
		var cookieString = key + "=" + escape(value); 
		
		//判断是否设置过期时间 
		if(expiresDays > 0){ 
			var date = new Date(); 
			date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); 
			cookieString += "; expires=" + date.toGMTString(); 
		}	
		document.cookie = cookieString; 
	},

	//获取指定名称的cookie,若没有返回""
	getCookie(key){ 
		var strCookie = document.cookie; 
		var arrCookie = strCookie.split("; "); 
		
		for(var i = 0; i < arrCookie.length; i++){ 
			var elem = arrCookie[i].split("="); 
			if(elem[0] == key)
				return elem[1];
		} 
		return ""; 
	},

	//删除指定名称的cookie
	deleteCookie(key){ 
		var date = new Date(); 
		
		date.setTime(date.getTime()-1); 
		document.cookie = key + "=v; expires=" + date.toGMTString(); 
	}
}