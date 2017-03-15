// JavaScript Document
//幻灯片
+function($,document){
  //创建幻灯片函数	
  function slide(element){
	    this.element=element;
		this.tip={};
	  }
	  
  //幻灯片初始化
  +function(){
	 var $slide=$('.blz-slide'); 
	 $slide.each(function(index, element) {
		var element=$(element);
		element.data('blz-slide-instance',new slide(element));
		var tip=element.data('blz-slide-instance').tip; 
		tip.tip=true;
		tip.timer=null;  
		var imgs=element.find('section');
		if(imgs.length<=1){
		  element.children('.blz-slid-image').siblings().hide();	
		}				   
     }); 
  }();
  
  //幻灯片播放
  slide.prototype.slideTo=function(){
	var parent=$(this).closest('.blz-slide')[0];
	var tip=$(parent).data('blz-slide-instance').tip;
	if(!tip.tip){return false};
	tip.tip=false;
	clearTimeout(tip.timer1);
	tip.timer1=setTimeout(function(){tip.tip=true},500);     
	var imgs=$(this).parent('.blz-slid-sign').siblings('.blz-slid-image');
	var index=$(this).data('blz-slide-to');
	if(index==imgs.find('section.active').data('blz-index')){return false};
	$(this).addClass('active').siblings().removeClass('active');
	imgs.find('section').eq(index).addClass('active').hide(0,function(){
	  $(this).show(400,function(){
	    $(this).siblings('.old').removeClass('old')
	  })
    }).siblings('.active').removeClass('active').addClass('old');	
  }
  slide.prototype.slideTab=function(){
	var parent=$(this).closest('.blz-slide')[0];
	var tip=$(parent).data('blz-slide-instance').tip;  
	if(!tip.tip){return false};
	clearTimeout(tip.timer1);
	tip.timer1=setTimeout(function(){tip.tip=true},500);
    var active=$(this).siblings('.blz-slid-sign').find('.active');
	var count=$(this).data('blz-slide-tab');
	if(count){
	  var prev=active.prev().length?active.prev():$(this).siblings('.blz-slid-sign').children().last();
	  prev.trigger('click.blz.slideTo');
	}else {
	  var next=active.next().length?active.next():$(this).siblings('.blz-slid-sign').children().first();
	  next.trigger('click.blz.slideTo');
	}
  }
  
  //自动播放幻灯片
  $.fn.onAutoSlide=function(){
	return this.each(function(index, element) {
	  var tip=$(element).data('blz-slide-instance').tip;	
	  clearTimeout(tip.timer);	
      $(this).find('button[data-blz-slide-tab="1"]').trigger('click.blz.slideTab'); 
	  var _this=this;
	  tip.on=true;
	  tip.timer=setTimeout(function(){
        $(_this).onAutoSlide();
	  },5000);
    });
  }
  //关闭自动播放幻灯片
  $.fn.offAutoSlide=function(){    
    return this.each(function(index,element){
	  var tip=$(element).data('blz-slide-instance').tip;
	  tip.on=0;	
	  clearTimeout(tip.timer);
	});
  }
  $(document).on('click.blz.slideTo','[data-blz-slide-to]',slide.prototype.slideTo);
  $(document).on('click.blz.slideTab','[data-blz-slide-tab]',slide.prototype.slideTab); 
  $(document).on('mouseenter','.blz-slide',function(event){
	var tip=$(event.currentTarget).data('blz-slide-instance').tip;  
	clearTimeout(tip.timer);
  });
  $(document).on('mouseleave','.blz-slide',function(event){ 
	var tip=$(event.currentTarget).data('blz-slide-instance').tip;  
	var _this=$(this);
    if(tip.on){tip.timer=setTimeout(function(){
	  _this.onAutoSlide();
	},5000)}
  }) 	  
}(jQuery,document);

//折叠 (collapse) 
+function($,window,document){
  
  //创建折叠函数
  function collapse(element){
	    this.element=element;
		this.tip={};
	  }
  //折叠函数初始化
  $('.blz-collapse').each(function(index, element) {
    var tip=$(element).data('blz-collapse-instance',new collapse(element)).data('blz-collapse-instance').tip;
	tip.old='';
	tip.tip=true;
	tip.timer=null;  
  });	  
  //折叠函数
  collapse.prototype.collapse=function(e){
	e.preventDefault();  
	var _this=$(this);  
	var parent=_this.closest('.blz-collapse');
	var tip=parent.data('blz-collapse-instance').tip;
	if(!tip.tip){return false};
	tip.tip=false;
	clearTimeout(tip.timer);
	tip.timer=setTimeout(function(){tip.tip=true},500);
	var target=parent.find(_this.attr('href'));
	if(tip.old!==_this.attr('href')&&tip.old!==''){$(tip.old).slideUp()}
	target.slideToggle();
	tip.old=_this.attr('href'); 
  }
  $(document).on('click.blz.collapse','[data-blz-toggle="blz-collapse"]',collapse.prototype.collapse);
}(jQuery,window,document);

//滚动动画依依不舍
+function($){
  var tip={
	    h:$(window).innerHeight(),
		scrollTop:$(window).scrollTop(),
		tip:true,
		timer:null,
		elements:$('[data-blz-hardtoleave]')
	  };
  //创建依依不舍函数
  function hardToLeave(element){
     this.scrollTop=0;
	 this.height=$(element).outerHeight();
	 this.tip=false;
  }
  //判断元素是否进入视野
  function scrollIntoView(element,height){
    var h=parseInt(element.getBoundingClientRect().top);
	return h<=tip.h&&h>=-height?true:false
  }
  //事件节流函数
  function chokeEvent(tip,fn){
	if(tip.tip){
		clearTimeout(tip.timer)
		tip.tip=false;
		setTimeout(function(){
			tip.tip=true;
			fn();
		},100);
	}
  }
  //动画元素初始化
  $('[data-blz-hardtoleave]').each(function(index,element) {
     var data=$(this).data('hardtoleave-instance',new hardToLeave(element)).data('hardtoleave-instance');
	 data.scrollTop=scrollIntoView(element,data.height)?0:$(this).offset().top-tip.h;
  });
  //执行动画
  hardToLeave.prototype.action=function(){
    for(var i=0;i<tip.elements.length;i++){
	  var data=tip.elements.eq(i).data('hardtoleave-instance');
	  if(scrollIntoView(tip.elements[i],data.height)){  
		var x=($(window).scrollTop()-data.scrollTop)*28/(tip.h+data.height);
	    tip.elements.eq(i).css({'transform':'translateY('+x+'px)','-webkit-transform':'translateY('+x+'px)'});
	  }
	}
  }
  $(window).on('scroll.blz.hardToLeave',function(){chokeEvent(tip,hardToLeave.prototype.action)});	  
}(jQuery,window,document);