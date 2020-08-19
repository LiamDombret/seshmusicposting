<?php
$conn= new mysqli("ID211210_sesh.db.webhosting.be", "ID211210_sesh", "arizonaicedout420", "ID211210_sesh");
if(!$conn) {
  die('Could not Connect My Sql:' .mysql_error());
}
$pass = $conn -> real_escape_string($_GET['pass']);
mysqli_select_db($conn, "ID211210_sesh");
$result=mysqli_query($conn, "SELECT pass FROM auth WHERE uID=1");
$data = mysqli_fetch_row($result);
if($pass == $data[0]) {
  setcookie("auth", "true", time() + 2592000, "sesh.liam.dombret.nxtmediatech.eu/");
  echo true;
} else {
  echo false;
}
mysqli_close($conn);
?>
