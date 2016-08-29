var faker= require('faker');

function generateCustomer()
{
	var customers=[];

	for(var id=0;id<40000;id++)
	{
		var custName=faker.name.firstName();
		var mobNo=faker.phone.phoneNumberFormat();
	

		customers.push({
			"id":id,
			"name":custName,
			"First Name":custName,
			"Mobile number":mobNo
		})
	}

return {"customers":customers}

}

module.exports=generateCustomer