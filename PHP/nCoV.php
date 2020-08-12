<?php
/**
 * [Open source] Vietnam nCoV Api
 * Author: Vy Nghia 
 **/

header('Content-type: application/json');

$dom = new DomDocument();
@ $dom->loadHTML(Get_nCoV());

$xPath = new DOMXpath($dom);

$xPathQuery = "//table[@id='sailorTable']//tbody//tr";
$elements = $xPath -> query($xPathQuery);

if(!is_null($elements)){
    $results = array();

    foreach($elements as $index => $element){
        $nodes = $element -> childNodes;

        $i = 0;
        foreach($nodes as $subindex => $node){
            if($node->nodeType == XML_ELEMENT_NODE) {
                $i++;

                if (strpos($node->nodeValue, 'BN') === false){
                    if($i == 1) $results[$index]["city"] = $node->nodeValue;
                    if($i == 2) $results[$index]["case"] = $node->nodeValue;
                    if($i == 3) $results[$index]["testing"] = $node->nodeValue;
                    if($i == 4) $results[$index]["recovered"] = $node->nodeValue;
                    if($i == 5) $results[$index]["death"] = $node->nodeValue;
                }
                else
                    break;
            }
        }
    }

    echo(json_encode($results));
}

function Get_nCoV() {
    $curl = curl_init();

    curl_setopt_array($curl, array(
    CURLOPT_URL => "https://ncov.moh.gov.vn/vi",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    ));
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);

    $response = curl_exec($curl);

    curl_close($curl);

    return $response;
}
