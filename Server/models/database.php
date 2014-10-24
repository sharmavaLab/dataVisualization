<?php
   
   class Database
   {
		private $database_connect;
		private $database;
		
		public function __construct()
		{
			$this->database_connect = new MongoClient("mongodb://rzawar:password@ds047950.mongolab.com:047950/datavisualization");
		}
		public function setDatabase($db)
		{
			$this->database = $this->database_connect->$db;
		}
		public function getCollection($collection)
		{
			return $this->database->$collection;
		}
   }
   
?>