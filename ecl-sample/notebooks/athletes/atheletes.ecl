r := RECORD
    UNSIGNED INTEGER4 id;
    VARSTRING name;
    VARSTRING nationality;
    VARSTRING sex;
    VARSTRING date_of_birth;
    REAL height;
    UNSIGNED INTEGER4 weight;
    VARSTRING sport;
    UNSIGNED INTEGER4 gold;
    UNSIGNED INTEGER4 silver;
    UNSIGNED INTEGER4 bronze;
    VARSTRING info;
END;

sprayed := DATASET('~::athletes.csv', r, CSV);

athletes := CHOOSEN(sprayed(date_of_birth != 'date_of_birth' AND height > 0 AND weight > 0), ALL); 

OUTPUT(athletes, NAMED('athletes')); 