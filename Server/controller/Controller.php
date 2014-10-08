<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/DataVisualization/Server/models/user.php';
class Controller
{	
	public function authenticate($userName,$password)
	{
		$user = new User($userName, $password);
		$isValid =  $user->authenticate();
		if($isValid)
			return "User Present";
		else
			return "User Not Present";
	}
}

?>