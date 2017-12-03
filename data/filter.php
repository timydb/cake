<?php
     header('content-type:application/json;charset=utf-8');
     @$class=$_REQUEST['class'];
     @$color=$_REQUEST['color'];
     @$weight=$_REQUEST['weight'];
     @$flavor=$_REQUEST['flavor'];
     @$tier=$_REQUEST['tier'];
     require('init.php');
     $sql="SELECT pname,pid,price,rating,isIndex,discount,img_l,weight FROM t_product WHERE class LIKE '%$class%' AND color LIKE '%$color%' AND weight LIKE '%$weight%' AND tier LIKE '%$tier%' AND flavor LIKE '%$flavor%'";
     $result=mysqli_query($conn,$sql);
     $rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
     if($rows!==[]){
         echo json_encode($rows);
     }else{
        echo '{"code":-1,"msg":"没有符合条件的结果"}';
     }

?>