$(function(){
    $.ajax({
        type:'get',
        url:'data/index.php',
        success(data){
            var html='';
            $.each(data,function(i){
                switch(parseInt(data[i].isIndex)){
                    case 1:
                        $("#main_img").attr("src","images/"+data[i].img_l).parent().attr("href","single.html?pid="+data[i].pid);
                        $(".pro_main .rating").addClass('sc'+data[i].rating);
                        $(".pro_main>p").html(data[i].pname);
                        $(".pro_main .price").html('￥'+data[i].price);
                        $(".pro_main .pro_bot a:last").attr('href','single.html?pid='+data[i].pid);
                        break;
                    case 2:
                        $("#sub_img").attr("src","images/"+data[i].img_l).parent().attr("href","single.html?pid="+data[i].pid);
                        $(".pro_sub .rating").addClass('sc'+data[i].rating);
                        $(".pro_sub>p").html(data[i].pname);
                        $(".pro_sub .price").html('￥'+data[i].price);
                        $(".pro_sub .pro_bot a:last").attr('href','single.html?pid='+data[i].pid);
                        break;
                    default:
                        html+=`<li>
                                    <div class="pro_item">
                                        <a href="single.html?pid=${data[i].pid}" class="pro_img"><img src="images/${data[i].img_l}" alt=""></a>
                                        <div class="pro_bot">
                                            <a href="">View</a>
                                            <a href="single.html?pid=${data[i].pid}" class="shop_now">SHOP NOW</a>
                                        </div>
                                        <p>${data[i].pname}</p>
                                        <div class="pro_info clear">
                                            <div class="price">￥${data[i].price}</div>
                                            <div class="rating sc${data[i].rating}" >
                                                <span>☆</span>
                                                <span>☆</span>
                                                <span>☆</span>
                                                <span>☆</span>
                                                <span>☆</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>`;
                }
            });
            $(".pro_list").html(html);

        }
    });
});