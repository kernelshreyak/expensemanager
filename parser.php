<?php

// This is a console program

$csvFile = file('/home/shreyak/Documents/expenses_data.csv');
$data = [];
foreach ($csvFile as $line) {
    $data[] = str_getcsv($line);
}

$fp = fopen("expensedata_exported.csv","w");
$i = 0;
foreach ($data as $row) {
    if($i > 0){
        $date = date("Y-m-d",strtotime($row[1]));
        $data[$i][1] = $date;
        $row[1] = $date;
    }

    fputcsv($fp, $row, ',');
    $i += 1;
}
fclose($fp);

// print_r($data);