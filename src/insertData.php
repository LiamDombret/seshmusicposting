<?php
$conn= new mysqli("ID211210_sesh.db.webhosting.be", "ID211210_sesh", "arizonaicedout420", "ID211210_sesh");
if(!$conn) {
  die('Could not Connect My Sql:' .mysql_error());
}
$videoLink =  $conn -> real_escape_string($_POST['link']);
$videoId =   $conn -> real_escape_string($_POST['id']);
$thumbnailLink =  $conn -> real_escape_string($_POST['thumbnail']);
$videoTitle =  $conn -> real_escape_string($_POST['title']);
$sql = "INSERT INTO youtubevideos (video_link, video_id, video_title, thumbnail_link) VALUES ('$videoLink', '$videoId', '$videoTitle', '$thumbnailLink')";
if (mysqli_query($conn, $sql)) {
  echo "New record created successfully!";
} else {
  echo "Error: " . $sql . "" . mysqli_error($conn);
}
mysqli_close($conn);
?>
