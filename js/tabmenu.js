var TabMenu;
TabMenu = function(ulelement,cArr){
	var linode = ulelement.childNodes;
	var lilength = linode.length;
	var cnt = 0;
	var colorArray = cArr;
		for(var i=0;i<lilength;i++){
			if(linode[i].tagName == "LI"){
				cnt++;
				this.addLiClickListener(linode[i],cnt);
			}
		}
}
TabMenu.prototype.currentTab = 1;


TabMenu.prototype.changeTab = function(tabindex){
}

TabMenu.prototype.addLiClickListener = function(lielement,index){
	$(lielement).click(function(){
		if(this.currentTab!=index){
			$("#tab"+this.currentTab).fadeTo("fast",0,function(){
				$("#tab"+this.currentTab).css("display","none");
				$("#tab"+index).fadeTo("fast",1,function(){
					$("#tab"+index).css("display","block");
					this.currentTab = index;					
				}.bind(this));
			}.bind(this));
		}
	}.bind(this));
}
