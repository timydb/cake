$(function(){
	//登录按钮
	function login(e){
            e.preventDefault();
            var h=(innerHeight-400)/2;
            $(".mask").css("top",0);
            $(".modal").css("bottom",h+"px");
            $("header,.banner,.container,.product,.subscribe,footer").addClass("blur");
            $("body").css("overflow","hidden");
	}
	//关闭登录框
    function close(){
        $(".mask").css("top","100%");
        $(".modal").css("bottom",-400+"px");
        $("header,.banner,.container,.product,.subscribe,footer").removeClass("blur");
        $("body").css("overflow","visible");
    }
	//退出登录
	function logout(e){
        e.preventDefault();
        $.ajax({
            type:"get",
            url:"data/logout.php",
            success(data){
                if(data.code==1){
                    sessionStorage.removeItem('isLogin');
                    sessionStorage.removeItem('uname');
                    $(".welcome").html("");
                    $("#login").off("click").click(login).find("span").toggleClass(function(){
                        if($(this).is(".glyphicon-user")){
                            return "glyphicon-log-out";
                        }else{
                            return "glyphicon-user";
                        }
                    });
                    $("i.close").click(close);
                    location.href="index.html";
                }
            }
        });
	}
	$("header").load("data/header.html",function(){
		$(".nav>li:not(:first-child)").hover(function(){
			$(this).css("backgroundColor","#F07818").children(".dropdown").addClass("open")
			.prev().children(".tri").css("transform","rotate(180deg)").parents("li").siblings().children(".dropdown").removeClass("open");
		},function(){
			$(this).css("backgroundColor","#5D4B33").children(".dropdown").removeClass("open").prev().children(".tri").css("transform","rotate(0deg)");
		});
		$(".header_right>li:first").hover(function(){
			$(".search").toggleClass("open");
		});
		//购物车
		$("#cart").click(function(e){
			e.preventDefault();
            if(!sessionStorage['isLogin']){
                $("#login").click();
            }else{
            	location.href="cart.html";
			}
		});
		$(".search .btn").click(function(e){
			e.preventDefault();
			location.href="product.html";
		});
		//登录框
		if(sessionStorage['isLogin']!=1){
            $(".welcome").html("");
            $("#login").click(login);
            $("i.close").click(close);
		}else{
            $(".welcome").html(sessionStorage['uname']);
            $("#login").click(logout).find("span").toggleClass(function(){
                if($(this).is(".glyphicon-user")){
                    return "glyphicon-log-out";
                }else{
                    return "glyphicon-user";
                }
            });
		}
	});
	//回到顶部
	function back(){
		var sTop=$(window).scrollTop();
		if(sTop>0){
			sTop-=100;
			$(window).scrollTop(sTop);
			var id=requestAnimationFrame(back);
		}
	}
	$("footer").load("data/footer.html",function(){
		$(window).scroll(function(){
			if($(window).scrollTop()>500){
				$(".top").css("opacity",1);
			}else{
				$(".top").css("opacity",0);
			}
		});
		$(".top").click(back);
	});
	//登陆
	$("#uname,#password").focus(function(){
		$(".login_tips").html('');
	});
	$("#btn_login").click(function(){
		var data={uname:$("#uname").val(),password:$("#password").val()}
		$.ajax({
			type:'post',
			url:'data/login.php',
			data:data,
			success(data){
				if(data.code){
					$(".login_tips").html(data.msg);
				}else{
					$("#uname,#password").val('');
					sessionStorage.setItem('isLogin',data[1]);
					sessionStorage.setItem('uname',data[0].uname);
					$("i.close").click();
					if(sessionStorage['isLogin']==1){
						$(".welcome").html("欢迎回来："+sessionStorage['uname']);
                        $("#login").off("click").click(logout).find("span").toggleClass(function(){
                            if($(this).is(".glyphicon-user")){
                                return "glyphicon-log-out";
                            }else{
                                return "glyphicon-user";
                            }
                        })
					}
				}
			}
		})
	})
});

