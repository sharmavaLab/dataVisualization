<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/DataVisualization/Server/models/user.php';
class Controller{	
	public function authenticate($userName,$password){
		$user = new User($userName, $password);
		$isValid =  $user->authenticate();
		if($isValid)
			return "User Present";
		else
			return "User Not Present";
	}
	public function insertUser($usrname,$upswd,$fname,$lname,$email){
		$user = new User($usrname, $upswd);
		$user->addOtherDtails($fname,$lname,$email);
		return $user->add();
	}
	public function insertUserUpload($username, $uploads){
		
		$user = new User($username,"");
		return $user->insertUploads($uploads);
	}
}

?>