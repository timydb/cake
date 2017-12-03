$(function(){
   $.ajax({
       type:"get",
       url:"data/cart_select.php",
       success(data){
           console.log(data);
           var cartList='';
           $.each(data,function(i,v){
               cartList+=`<div class="cart_item clear">
					<div class="check">
						<input type="checkbox">
					</div>
					<div class="item_main clear">
						<div class="item_info msg clear">
							<div class="cart_img">
								<a href="single.html?pid=${v.pid}" class="pid"><img src="images/${v.img_l}" alt=""></a>
							</div>
							<div class="info">
								<h3><a href="#">${v.pname}</a><span>主要原料：${v.material}</span></h3>
								<ul class="qty">
									<li><p>规格：<span class="weight">${v.weight}</span>磅</p></li>
									<li><p>FREE delivery</p></li>
								</ul>
							</div>
							<div class="delivery">
								<p>优惠 : ${v.discount}%</p>
								<span>Delivered in 1-1:30 hours</span>
							</div>	
						</div>
						<div class="item_info price">￥<span>${parseInt(v.price*(100-v.discount)/100)}</span>/磅</div>
						<div class="item_info count">
							<button>-</button>
							<input type="text" value="${v.count}">
							<button>+</button>
						</div>
						<div class="item_info total">￥<span>${parseInt(v.price*(100-v.discount)/100)*v.count*v.weight}</span></div>
						<div class="item_info opt"><a href="">删除</a></div>
					</div>
				</div>`;
           });
           $("#item_list").html(cartList);
		   $(".count button:first-child").click({a:-2},cartChange);
		   $(".count button:last-child").click({a:-1},cartChange);
		   $(".opt a").click({a:-3},cartChange);
		   $(".cart_item :checkbox").change(function(){
			   var isAll=Array.prototype.every.call($(".cart_item :checkbox"),function(v){return v.checked==true});
			   if(isAll){
				   $("#all").prop("checked",true);
			   }else{
				   $("#all").prop("checked",false);
			   }
			   sum();
		   });
		   canPay();
	   }
   });
	function cartChange(e){
		e.preventDefault();
		var a=e.data.a;
		var data={};
		var $this=$(this);
		var oldCount=parseInt($this.siblings("input").val());
		if(!(a==-2&&oldCount<=1)){
			if(a==-1){
				$this.siblings("input").val(oldCount+1);
			}else if(a==-2){
				$this.siblings("input").val(oldCount-1);
			}else{
				if(!confirm("确定删除？")){
					return;
				}
			}
			data.count=a;
			data.weight=parseInt($this.parent().siblings(".msg").find("span.weight").html());
			var href=$this.parent().siblings(".msg").find("a.pid").attr("href");
			var arr=href.split("=");
			data.pid=parseInt(arr[arr.length-1]);
			$.ajax({
				type:"get",
				url:"data/cart_add.php",
				data:data,
				success(data){
					if(data.code==2){
						var $this=$(e.target);
						var total=0;
						var old=parseInt($this.parent().next().find("span").html());
						var price=parseInt($this.parent().prev().find("span").html());
						var weight=parseInt($this.parent().siblings(".msg").find(".weight").html());
						if(a==-1){
							total=old+price*weight;
							$this.parent().next().find("span").html(total);
						}else if(a==-2){
							total=old-price*weight;
							$this.parent().next().find("span").html(total);
						}else if(a==-3){
							$this.parents(".cart_item").remove();
						}
						sum();
					}
				}
			});
		}
	}
	//全选
	$("#all").change(function(){
		var check=$(this).prop("checked");
		$(".cart_item :checkbox").prop("checked",check);
		sum();
	});
	function sum(){
		var total=0;
		var count=0;
        $(".cart_item :checked").each(function(){
        	total+=parseInt($(this).parent().next().find(".total span").html());
			count+=1;
		});
        $("#price_total").html("￥"+total);
		$("#num_total").html(count);
		canPay();
	}
	function canPay(){
		var notEmpty=Array.prototype.some.call($(".cart_item :checkbox"),function(v){return v.checked==true});
		if(notEmpty){
			$("#pay").prop("disabled",false);
		}else{
			$("#pay").prop("disabled",true);
		}
	}
	//结算
	$("#pay").click(function(){
		var html="您购买了"+$("#num_total").html()+"件商品，共消费"+$("#price_total").html()+"元";
		$("#cart_msg").html(html);
		$("#shop").click(function(){
			location.href="product.html";
		});
		$("#to_cart").click(function(){
			location.href="index.html";
		});
		$(".cart_add").show();
	})
});