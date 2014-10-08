<?php
require_once 'database.php';
class User
{
	private $userName;
	private $password;
	private $database;
	public function __construct($userName,$password)
	{
		$this->userName = $userName;
		$this->password = $password;
		$this->database = new Database;
	}
	public function setUserName($userName)
	{
		$this->userName = $userName;
	}
	public function getUserName()
	{
		return $this->userName;
	}
	public function setPassword($password)
	{
		$this->password = $password;
	}
	public function getPassword()
	{
		return $this->password;
	}
	public function authenticate()
	{
		$this->database->setDatabase('DataVisualization');
		$collection = $this->database->getCollection('user');
		$userName = $collection->findOne(array('_id' => "$this->userName", 'password'=>"$this->password"));
		//print_r($userName);
		if (!$userName['_id'])	
			return false;
		else
			return true;
	}
}
?>