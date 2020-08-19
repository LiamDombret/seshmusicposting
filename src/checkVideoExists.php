<?php
$response = file_get__contents('https://www.googleapis.com/youtube/v3/videos?part=id&id=' . getID(videoLink) . '&key=' . $apiPublicKey);
$json = json_decode($response);
if (sizeof($json['items'])) {
  return true;
} else {
  return false;
}
?>
