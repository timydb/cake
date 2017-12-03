$(function(){
    $(".rating").on("click","span",function(){
        $(".rating").removeClass(function(i,oldClass){
            var reg=/rating/;
            return oldClass.replace(reg,"");
        });
        $(this).addClass("selected").siblings().removeClass("selected");

    });
    var url=window.location.search;
    var arr=url.split("=");
    var pid=parseInt(arr[arr.length-1]);
    $.ajax({
        type:"get",
        url:"data/single.php",
        data:{pid},
        success(data){
            var msg=data.msg[0];
            var images=data.images;
            var img='';
            var page='';
            $.each(images,function(i,v){
                img+=`<li class="swiper-slide"><img src="images/${v.img}" alt=""></li>`;
            });
            $("#img_big").html(img);
            $("#pname").html(msg.pname);
            $("#pdetail").html(msg.detail);
            $("#pmaterial").html("主要原料："+msg.material);
            $(".item_price").html("￥"+parseInt(msg.price*(100-msg.discount)/100)+"/磅");
            $(".rating").addClass("sc"+msg.rating);
            var weight=msg.weight.split(",");
            $(".size input").each(function(i){
                for(var j=0;j<weight.length;j++){
                    if((i+1)==weight[j]){
                        $(this).prop("disabled",false).next().css("color","#5D4B33");
                    }
                }
            });
            $(".size input:not(:disabled):first").prop("checked",true);
            var mySwiper = new Swiper ('.swiper-container', {
                loop: true,
                pagination: '.swiper-pagination',
                paginationType:"custom",
                paginationCustomRender: function (swiper, current, total) {
                    var page='';
                    for (var i = 1; i <= total; i++) {

                        if (current == i) {
                            page += '<li class="swiper-pagination-custom active"><img src="images/'+images[i-1].img+'" alt=""></li>';
                        }else{
                            page += '<li class="swiper-pagination-custom"><img src="images/'+images[i-1].img+'" alt=""></li>';
                        }
                    }
                    return page;
                },
                autoplay:2000,
                autoplayDisableOnInteraction:false
            });
            $('.swiper-pagination').on('click','li',function(){
                var index = $(this).index();
                mySwiper.slideTo(index+1, 500, false);
            });
            $(".super_mask").mouseover(function(){
                mySwiper.stopAutoplay();
            }).mouseout(function(){
                mySwiper.startAutoplay();
            });
            var $mask=$(".img_mask");
            var $large=$(".large");
            var $super=$(".super_mask");
            var MSIZE=parseFloat($mask.css("width"));
            var SW=parseFloat($(".bigImg").css("width"));
            var SH=parseFloat($(".bigImg").css("height"));
            var MAXLEFT=SW-MSIZE;
            var MAXTOP=SH-MSIZE;
            $super.mouseenter(function(){
                $mask.show();
                var src=$(".img_sm .active").find("img").attr("src");
                $large.find("img").attr("src",src);
                $large.show();
            }).mouseleave(function(){
                $mask.hide();
                $large.hide();
            }).mousemove(function(e){
                var left=e.offsetX-MSIZE/2;
                var top=e.offsetY-MSIZE/2;
                left=left<0?0:left>MAXLEFT?MAXLEFT:left;
                top=top<0?0:top>MAXTOP?MAXTOP:top;
                $mask.css({left,top});
                $large.find("img").css({left:-2*left+"px",top:-2*top+"px"});
            })

        }
    });
    $("#add").click(function(e){
        e.preventDefault();
        if(!sessionStorage['isLogin']){
            $("#login").click();
        }else{
            var product={};
            product.weight=parseInt($(".size input:checked").val());
            product.count=parseInt($("#quantity").val());
            product.pid=pid;
            $.ajax({
                type:'get',
                url:'data/cart_add.php',
                data:product,
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
            })
        }
    });


});