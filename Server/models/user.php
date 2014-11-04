<?php
require_once 'database.php';
class User
{
	private $userName;
	private $password;
	private $fname;
	private $lname;
	private $email;
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
	public function addOtherDtails($fname,$lname,$email)
	{
		$this->fname = $fname;
		$this->lname = $lname;
		$this->email = $email;
	}
	public function authenticate()
	{
		$this->database->setDatabase('datavisualization');
		$collection = $this->database->getCollection('user');
		$userName = $collection->findOne(array('_id' => "$this->userName", 'password'=>"$this->password"));
		$this->database->database_connect->close();
		if (!$userName['_id'])	
			return false;
		else
			return true;
	}
	public function add()
	{
		$this->database->setDatabase('datavisualization');
		$collection = $this->database->getCollection('user');
		$user = array(
                        '_id' =>"$this->userName",
                        'password' => "$this->password",
						'lastname' => "$this->lname",
						'firstName' => "$this->fname",
						'email' => "$this->email"
                        );
		try{
		$isInsert = $collection->insert( $user);
		$this->database->database_connect->close();
		}
		catch (MongoWriteConcernException $e) {
				$this->database->database_connect->close();
		  return "Failure ";
		}
		if($isInsert)
			return "Success";
		else
			return "Failure";
		}
}
?>