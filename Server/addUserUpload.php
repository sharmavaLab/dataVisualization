<?php
require_once './controller/Controller.php';
   
   $data = json_decode(file_get_contents("php://input"));
   $username = mysql_real_escape_string($data->uname);
   $uploads = $data->uploads;
  
   $ctrl = new Controller;
   //echo json_encode($uploads);
   echo $ctrl->insertUserUpload($username,$uploads);

?>