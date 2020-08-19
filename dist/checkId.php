<?php
$conn= new mysqli("ID211210_sesh.db.webhosting.be", "ID211210_sesh", "arizonaicedout420", "ID211210_sesh");
if(!$conn) {
  die('Could not Connect My Sql:' .mysql_error());
}
$id = $conn -> real_escape_string($_GET['id']);
mysqli_select_db($conn, "ID211210_sesh");
$result=mysqli_query($conn, "SELECT id FROM youtubevideos WHERE video_id='$id'");
if(mysqli_num_rows($result) > 0) {
  echo true;
} else {
  echo false;
}
mysqli_close($conn);
?>
