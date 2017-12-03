$(function(){
	//侧边栏
	$(".tabs>li>a").click(function(e){
		e.preventDefault();
		$(this).next().slideToggle();
		var $uls=$(this).parent().siblings().children("ul");
		$uls.each(function(i){
			if($uls.eq(i).css("display")!="none"){
				$uls.eq(i).slideToggle();
			}
		});
	});
	function ref(){
        $.ajax({
            type:'get',
            url:'data/productlist.php',
            success(data){
                var page='';
                var products=data.data;
                var pageNo=data.page;
                pro_list(products);
                page+=`<li><a href="#plist">上一页</a></li>`;
                for(var i=0;i<pageNo;i++){
                    page+=`<li><a href="#plist">${i+1}</a></li>`;
                }
                page+=`<li><a href="#plist">下一页</a></li>`;
                $('.page_tabs').html(page).find("a").click(pageChange).eq(1).addClass("active");
            }
        });
	}
	ref();
    function pro_list(products){
        var list='';
        $.each(products,function(i){
            list+=`<li>
					<div class="pro_pic">
						<a href=""><img src="images/${products[i].img_l}"></a>
						<div class="b-wrapper">	
							<div class="btn_box">
								<a href="single.html?pid=${products[i].pid}">View</a>
							</div>					
						</div>
					</div>
					<div class="pro_info">
						<h4>${products[i].pname}</h4>
						<p>￥${parseInt(products[i].price*(100-products[i].discount)/100)}/磅</p>
						<div class="off">
							<del>￥${parseInt(products[i].price)}/磅</del>
							<span>[${products[i].discount}% Off]</span>
						</div>
						<input type="text" name="count" value=1 id="count">
						<input type="button"  value="Add" class="add">
					</div>
				</li>`;
		});
        $(".pro_list").html(list);
        $(".off").each(function(){
            var del=$(this).find("del");
            var price=$(this).prev();
            if(del.html()==price.html()){
                del.hide();
                $(this).find("span").html("暂无优惠");
            }
        })
        //添加到购物车
        $(".add").click({pro:products},add)
    }
    function add(e){
        var products=e.data.pro;
        if(!sessionStorage['isLogin']){
            $("#login").click();
        }else{
            var pro={};
            var i=$(".add").index($(this));
            var weight=products[i].weight.split(",")[0];
            pro.pid=products[i].pid;
            pro.weight=weight;
            pro.count=$(this).prev().val();
            $.ajax({
                type:"get",
                url:"data/cart_add.php",
                data:pro,
                success(data){
                    if(data.code){
                        $("#cart_msg").html("商品添加成功！");
                        $(".cart_add").show();
                        $("#shop").click(function(){
                            location.href="product.html";
                        });
                        $("#to_cart").click(function(){
                            location.href="cart.html";
                        });
                    }else{
                        $("#cart_msg").html("商品添加失败！");
                        $(".cart_add").show();
                    }
                }
            });
        }
    }
	function pageChange(){
    	var data={};
    	var $as=$(".page_tabs a");
    	var $this=$(this);
    	var $active=$(".active");
    	switch($as.index($this)){
			case 0:
				if($as.index($active)!==1){
                    data={pageNo:parseInt($active.html())-1};
                    pageUD.bind(this)(data);
				}
				break;
			case $as.length-1:
                if($as.index($active)!=$as.length-2){
                    data={pageNo:parseInt($active.html())+1};
                    pageUD.bind(this)(data);
				}
				break;
			default:
				data={pageNo:parseInt($this.html())};
                pageUD.bind(this)(data);
		}
	}
	function pageUD(data){
        var $as=$(".page_tabs a");
        var $this=$(this);
        var $active=$(".active");
        $.ajax({
            type:'get',
            url:'data/productlist.php',
            data:data,
            success:function(data){
                var products=data.data;

                pro_list(products);
                if($this.is(".page_tabs a:first")){
                	if($as.index($active)!=1){
                        $active.removeClass("active").parent().prev().children().addClass("active");
					}
                }else if($this.is(".page_tabs a:last")){
                    if($as.index($active)!=$as.length-2){
                        $active.removeClass("active").parent().next().children().addClass("active");
                    }
				} else{
                	if($this.className==undefined){
                        $this.addClass('active').parent().siblings().children().removeClass('active');
					}
				}

            }.bind(this)

        })
	}
	//检索
    function value(){
        var type=$(".select").html();
        var flavor=$("#flavor input:checked").val();
        var weight=$("#weight input:checked").val();
        var color=$("#color input:checked").val();
        var option={class:type,flavor,weight,color};
        return option;
    }
    $(".aside input").change(filter);

    $(".regular a").click(function(e){
    	e.preventDefault();
    	if($(this).className===undefined){
            $(this).addClass("select");
            var i=$(".regular a").index($(this));
            $(".regular a:not(:eq("+i+"))").removeClass("select");
		}
        filter();

	});
    function filter(){
        $('.pro_list').removeClass("empty");
        var type=$(".regular .select").html();
        var flavor=$("#flavor input:checked").val();
        var weight=$("#weight input:checked").val();
        var color=$("#color input:checked").val();
        var option={class:type,flavor,weight,color};
        $.ajax({
            type:'get',
            url:'data/filter.php',
            data:option,
            success(data){
            	if(data.code){
                    $('.pro_list').html("对不起，未找到相应的商品 <button id='ref'>返回</button>").addClass("empty");
                    $("#ref").click(function(){
                        $('.pro_list').removeClass("empty");
                    	ref();
                    	$("input:checked").prop("checked",false);
                    	$(".regular").slideUp().find("a").removeClass("select");
					});
				}else{
                    pro_list(data);
				}
                $('.page_tabs').html("");
            }
        })
    }
});


