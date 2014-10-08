<?php

 require_once './controller/Controller.php';
   
   $data = json_decode(file_get_contents("php://input"));
   $usrname = mysql_real_escape_string($data->uname);
   $upswd = mysql_real_escape_string($data->password);
   $fname = mysql_real_escape_string($data->fname);
   $lname = mysql_real_escape_string($data->lname);
   $email = mysql_real_escape_string($data->email);
   $ctrl = new Controller;
   echo "Rohit";
   echo $ctrl->insertUser($usrname,$upswd,$fname,$lname,$email); 

?>