var students = [{name:"Cindy",age:"100",score:"88"},{name:"Aindy",age:"100",score:"88"},{name:"Dindy",age:"99",score:"88"}];

function createCompact(pNum){
	return function (object1,object2)
	{
		var value1 = parseInt(object1[pNum]);
		var value2 = parseInt(object2[pNum]);
		if(value1 < value2)
		{
			return -1;
		}
		else if(value1 > value2)
		{
			return 1;
		}
		else
		{
			return 0;
		}
	};
}

function createCompactName(pName){
	return function (object1,object2)
	{
		var value1 = object1[pName];
		var value2 = object2[pName];
		if(value1 < value2)
		{
			return -1;
		}
		else if(value1 > value2)
		{
			return 1;
		}
		else
		{
			return 0;
		}
	};
}
students.sort(createCompactName('name'));
students.sort(createCompact('score'));
students.sort(createCompact('age'));



cnt = 1;
students[0].index = cnt;
for(var i = 1;i < students.length;i++){
	if(students[i].age == students[i-1].age){
		cnt++;
		students[i].index = cnt;
	}
		
	else{
		cnt = 1;
		students[i].index = cnt;
	}		
};