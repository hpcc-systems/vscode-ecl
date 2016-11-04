MyRec := RECORD
	STRING1 Value1;
	STRING1 Value2;
END;

SomeFile := DATASET([{'C','G'},{'C','C'},{'A','X'},{'B','G'},{'A','B'}],MyRec);

MyOutRec := RECORD
	myRec.Value1;
	SomeFile.Value2;
	STRING4 CatValues;
END;

MyOutRec CatThem(SomeFile L, INTEGER C) := TRANSFORM
	SELF.CatValues := 
	L.Value1 + L.Value2 + '-' + (STRING)C;
	SELF := L;
END;

CatRecs := PROJECT(SomeFile,
                   CatThem(LEFT,COUNTER));

OUTPUT(CatRecs);
