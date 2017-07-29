<?php
require_once 'twig/lib/Twig/Autoloader.php';
Twig_Autoloader::register();
$loader = new Twig_Loader_Filesystem('../ibuhotelapp/');
$twig   = new Twig_Environment($loader);
$datos ="";

$mode = $_GET['mode'] ;
 
if($mode=="master"){
    echo $twig->render('crud.html', array('dato' => $datos));
    exit;
}

if($mode=="locations"){
    echo $twig->render('locations.html', array('dato' => $datos));
    exit;
}

if($mode=="reservations"){
    echo $twig->render('reservations.html', array('dato' => $datos));
    exit;
}


if($_POST){
    echo $twig->render('dashboard.html', array('dato' => $datos));
    exit;
}

    echo $twig->render('sign-in.html', array('dato' => $datos));
    exit;
?>
