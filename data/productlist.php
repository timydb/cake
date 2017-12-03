<?php
    header("content-type:application/json;charset=utf-8");
    require('init.php');
    if(empty($_REQUEST['pageNo'])){
        @$pageNo=1;
    }else{
        $pageNo=$_REQUEST['pageNo'];
    }
    $start=($pageNo-1)*9;
    $sql="SELECT count(pid) FROM t_product";
    $result=mysqli_query($conn,$sql);
    $row=mysqli_fetch_row($result);
    if($row!==null){
        $count=ceil($row[0]/9);
    }
    $output['page']=$count;
    $sql="SELECT pname,pid,price,rating,isIndex,discount,img_l,weight FROM t_product LIMIT $start,9";
    $result=mysqli_query($conn,$sql);
    $rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
    $output['data']=$rows;
    echo json_encode($output);
?>