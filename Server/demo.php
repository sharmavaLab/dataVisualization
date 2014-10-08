<?php
/*$data = file_get_contents("php://input");
$p = json_decode($data);
$user = $p->username;
$password = $p['password'];
echo json_last_error();
echo "$p Values are :  $user - $password";
*/
$data = json_decode(file_get_contents("php://input"));
$usrname = mysql_real_escape_string($data->uname);
$upswd = mysql_real_escape_string($data->pswd);

echo "Worlin $usrname : $upswd";

?>