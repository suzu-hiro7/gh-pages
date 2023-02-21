<?php
$options['ssl']['verify_peer']=false;
$options['ssl']['verify_peer_name']=false;
// S100EZ8M
 print_r(file_get_contents("https://disclosure.edinet-fsa.go.jp/api/v1/documents.json?date=2019-04-26&type=2", false, stream_context_create($options)));

//header('Content-type: application/pdf');
//print_r(file_get_contents("https://disclosure.edinet-fsa.go.jp/api/v1/documents/S100EZ8M?type=2", false, stream_context_create($options)));