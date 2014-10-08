<?php
 require_once './controller/Controller.php';
   
   $data = json_decode(file_get_contents("php://input"));
   $usrname = mysql_real_escape_string($data->uname);
   $upswd = mysql_real_escape_string($data->pswd);
   $ctrl = new Controller;
   echo $ctrl->authenticate($usrname,$upswd);   
?>