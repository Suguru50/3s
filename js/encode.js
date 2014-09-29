function isNull(Sso_data){
	if(Sso_data==""){
		Sso_data = "default";
		return false;
	}else if(Sso_data.indexOf("Å@")!=-1){
		Sso_data = "default";
		return false;
	}else{
		return true;
	}
}
