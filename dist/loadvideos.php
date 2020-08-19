<?php
$conn= new mysqli("ID211210_sesh.db.webhosting.be", "ID211210_sesh", "arizonaicedout420", "ID211210_sesh");
if(!$conn) {
  die('Could not Connect My Sql:' .mysql_error());
}
mysqli_select_db($conn, "ID211210_sesh");
$result=mysqli_query($conn, "SELECT * FROM youtubevideos");
while($data = mysqli_fetch_row($result)) {
  echo "$data[1];";
  echo "$data[2];";
  echo "$data[3];";
  echo "$data[4];";
  echo "$data[5]\r\n";
}
mysqli_close($conn);
?>
