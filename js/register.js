$(function(){
    //表单验证
    var result=Array.apply(null,{length:5});//创建数组保存表单验证结果
    function tips(elem,str){
        $(elem).prev().html(str).css("display","block");
    }
    function valid(reg,elem,str1,str2,check,checkMsg){
        var value=$(elem).val();
        var i=$(".result").index($(elem));
        if(value&&!reg.test(value)){
            $(elem).prev().html(str1).css({display:"block",color:"#f00"});
            result[i]=false;
        }else if(!value){
            $(elem).prev().html(str2).css({display:"block",color:"#f00"});
            result[i]=false;
        }else{
            result[i]=true;
            $(elem).prev().css({display:"none",color:"#999"});
            if(check){
                var param=$(elem).attr("id")+"="+$(elem).val();
                $.ajax({
                    type:'get',
                    url:'data/check.php',
                    data:param,
                    success(data){
                        if(data.length!==0){
                            $(elem).prev().html(checkMsg).css({display:"block",color:"#f00"});
                        }
                    }
                })
            }
        }
    }
    function form(selector,reg,str1,str2,str3,check,checkMsg){
        $(selector).focus(function(){
            tips(this,str1);
        }).blur(function(){
            valid(reg,this,str2,str3,check,checkMsg);
        });
    }
    var regUname=/^[a-zA-Z0-9]{2,12}$/;
    var uname1="2-12位字母数字组合";
    var uname2="用户名格式错误";
    var uname3="用户名不能为空";
    var unameCheck="该用户名已被注册";
    form("#user_name",regUname,uname1,uname2,uname3,true,unameCheck);
    var regPhone=/^1[34578]\d{9}$/;
    var phone1="请输入手机号";
    var phone2="请输入正确的手机号";
    var phone3="手机号不能为空";
    var phoneCheck="该手机号已被注册";
    form("#phone",regPhone,phone1,phone2,phone3,true,phoneCheck);
    var regEmail=/^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)?@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    var email1="请输入邮箱地址";
    var email2="请输入正确的邮箱地址";
    var email3="邮箱不能为空";
    var emailCheck="该邮箱已被注册";
    form("#email",regEmail,email1,email2,email3,true,emailCheck);
    var regPwd=/^[a-zA-Z0-9]{6,10}$/;
    var pwd1="请输入密码";
    var pwd2="密码格式错误";
    var pwd3="密码不能为空";
    form("#pwd",regPwd,pwd1,pwd2,pwd3,false);
    var cpwd1="请确认密码";
    var cpwd2="请输入正确的密码";
    var cpwd3="密码不能为空";
    $("#con_pwd").focus(function(){
        tips(this,cpwd1);
    }).blur(function(){
        var pwd=$("#pwd").val();
        var str=$(this).val();
        var i=$(".result").index($(this));
        if(str&&pwd===str){
            $(this).prev().css({display:"none",color:"#999"});
            result[i]=true;
        }else if(!str){
            $(this).prev().html(cpwd3).css({display:"block",color:"#f00"});
            result[i]=false;
        }else{
            $(this).prev().html(cpwd2).css({display:"block",color:"#f00"});
            result[i]=false;
        }
    });
    function showAlert(){
        $("#reg_alert").css({opacity:0,zIndex:-1});
    }
    $("#btn_reg").click(function(){
        var res=result.every(function(v){return v==true});
        if(res){
            var data={user_name:$("#user_name").val(),pwd:$("#pwd").val(),phone:$("#phone").val(),email:$("#email").val()};
            $.ajax({
                type:'post',
                url:'data/register.php',
                data:data,
                success(data){
                    if(data.code>0){
                        $("#user_name,#pwd,#phone,#email,#con_pwd").val("");
                        result.forEach(function(v,i,arr){return arr[i]=false});
                        $("#reg_alert").html(data.msg+"! 请登录").css({opacity:1,zIndex:"auto"});
                        setTimeout(function(){
                            showAlert();
                            $("#login").click();
                        },1000);
                    }else{
                        $("#reg_alert").html(data.msg+"请重试").css({opacity:1,zIndex:"auto"});
                        setTimeout(function(){
                            showAlert();
                            $("#login").click();
                        },1000);
                    }
                }
            })
        }else{
            $("#reg_alert").html("请填写完整信息").css({opacity:1,zIndex:"auto"});
            setTimeout(showAlert,1000)
        }
    })
});