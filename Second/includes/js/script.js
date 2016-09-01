$(function(){

	var count=0;
	var counter=0;
	var limit=20;
	var length=0;

	countryTable= $('#countrytable');
	// $modalbody=$('#modalbody');
	// $btnAdd=$('#btnAdd');
	$modal=$('.modalc');
	modalPlayer=$('.modalPlayer');


//Pager List
$first=$('#first');
$last=$('#last');

function hidePager()
{
	$first.hide();
	$last.hide();
	$('#pager-ul').hide();
};

	getTable();

	$('#viewAll').on('click',getTable);		//call to view Table on viewall table
	$('#search').on('click',getRow);		//to search by country Name
	$('#form1').on('submit',addRow);		//to add a row

	$('.table-condensed').on('click','.glyphicon-trash',deleteRow);  //delete call
	$('.table-condensed').on('click','.glyphicon-edit',showRow);	//update call

	$first.on('click',function(){
		getNextTable(0);
	});

	$last.on('click',function(){
		getNextTable(length-20);
	});

//Starting funciton to show the table
function getTable()
{
	$('#viewAll').hide();

	$first.show();
	$last.show();

	$('#pager-ul').show();

	counter=0;
	$.ajax({
		type:'GET',
		url:'http://localhost:3000/countries/?_start='+counter+'&_limit='+limit,
		success:function(data,status,res)
		{
			if(data.length==0)
			{
				alert("No data Exist")
			}
			else
			{
				length=res.getResponseHeader('X-Total-Count');
				countryTable.empty();
				appendTableHeader(data);
			}
		},
		error:function()
		{
			alert("Error Happen");
		}
	});
};


//function used to append table header 
function appendTableHeader(data)
{
	countryTable.append("<thead><tr><th>Country Name</th><th>Gold Medals</th> <th>Silver Medals</th> <th>Bronze Medals</th> <th>Total Medals</th><th>Edit</th></tr></thead>");		
	appendTableRows(data);
};

//fucntion to append Table Rows
function appendTableRows(data)
{
	$.each(data,function(i,country){
		countryTable.append("<tr id='"+country.id+"r'><td class='country' data-toggle='modal'><a href='#'>"+country.countryName+
			"</a></td><td>"+country.gold+
			"</td><td>"+country.silver+
			"</td><td>"+country.bronze+
			"</td><td>"+country.total+
			"</td><td><span class='glyphicon glyphicon-edit' id='"+country.id+"e'>&nbsp</span><span class='glyphicon glyphicon-trash' id='"+country.id+"'></span></td></tr>");
		countryTable.append("<tr class='updaterow' id='"+country.id+"er'><td colspan='6' id='"+country.id+"ed'></td></tr>");
		$('#'+country.id+'er').hide();
	});
};



//function to show the contents of table
function getNextTable(counter)
{
	$('#viewAll').hide();
	$.ajax({
		type:'GET',
		url:'http://localhost:3000/countries/?_start='+counter+'&_limit='+limit,
		success:function(data)
		{
			if(data.length==0)
			{
				alert("No Data Exist");
			}
			else
			{
				countryTable.empty();
				appendTableHeader(data);
			}
		},		
		error:function()
		{
			alert("Error Happen");
		}
	});
};

//Get Command to search One row
function getRow(){
	$('#viewAll').show();
	$countryName=$('#countryName').val();
	hidePager();

	countryTable.empty();
	if($countryName.trim().length===0)
	{
		alert("Please Enter Country Name to search");
	}
	else
	{
		$.ajax({
			type:'GET',
			url:'http://localhost:3000/countries/?q='+$countryName,
			success:function(data){
				if(data.length===0)
				{
					alert("Country Didn't exist");
				}
				else
				{
					appendTableHeader(data);
				}
			},
			error:function()
			{
				alert("Error Happen");
			}

		});
	}
};

//Delete Row Function
function deleteRow()
{
	var answer=confirm("Are You Sure Want to Delete!!");
	if(answer)
	{
		$('#'+this.id+'er').remove();
		$('#'+this.id+'r').remove();
		$.ajax({
			type:'DELETE',
			url:'http://localhost:3000/countries/'+this.id,
			success:function()
			{
				length -=1;
				alert("Deleted");
			},
			error:function()
			{
				alert("Error Happen");
			}

		});
	}
}


//Post Command to add row
function addRow(e)
{
	e.preventDefault();
	$inputName=$('#inputName').val();
	$inputGold=$('#inputGold').val();
	$inputSilver=$('#inputSilver').val();
	$inputBronze=$('#inputBronze').val();
	$total=parseFloat($inputGold)+parseFloat($inputSilver)+parseFloat($inputBronze);
	var countries={"countryName": $inputName,"gold": $inputGold,"silver": $inputSilver,"bronze": $inputBronze,"total":$total};
	$.ajax({
		type:'POST',
		data:countries,
		url:'http://localhost:3000/countries',
		success:function(country)
		{
			var data1=[country];
			length +=1;
			$modal.modal('toggle');
			$('#form1')[0].reset();
			appendTableRows(data1);
		},
		error:function()
		{
			alert("Error Happen");
		}

	})
};


	//show the hidden row of editing
	function showRow()
	{
		$rowId=$(this.id);
		$rowId=$rowId.selector.trim().replace('e','r');
		$tdId=$('#'+this.id+'d');
		$('.updaterow').hide();
		$('#'+this.id+'r').fadeToggle();
		$tdId.html("<form class='form2'><label>Country Name</label><input type='text' id='updatedCountryName' pattern='^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$' required value='"+$('#'+$rowId).find('td:first')[0].innerText+
			"'><br><label>Gold Medals</label><input type='number' id='updatedGoldMedals' required value='"+$('#'+$rowId).find('td:nth-child(2)')[0].innerText+
			"'><br><label>Silver Medals</label> <input type='number' id='updatedSilverMedals' required value='"+$('#'+$rowId).find('td:nth-child(3)')[0].innerText+
			"'><br><label>Bronze Medals</label> <input type='number' id='updatedBronzeMedals' required value='"+$('#'+$rowId).find('td:nth-child(4)')[0].innerText+
			"'><br><label>Total Medals</label> <input type='number' id='updatedTotalMedals' required value='"+$('#'+$rowId).find('td:nth-child(5)')[0].innerText+
			"'><br><input type='button' class='closeBtn btn-danger btn-large' value='Close'><input type='submit' value='Update' class='btn-large btn-success' id='updateBtn'></form>");

		$('.form2').on('submit',updateRow);
		$('.closeBtn').on('click',function()
		{
			$('.updaterow').hide();
		});
	};

//Put Command
function updateRow(e)
{
	e.preventDefault();
	$updatedCountryName=$('#updatedCountryName').val();
	$updatedGoldMedals=$('#updatedGoldMedals').val();
	$updatedSilverMedals=$('#updatedSilverMedals').val();
	$updatedBronzeMedals=$('#updatedBronzeMedals').val();
	$updatedTotalMedals=$('#updatedTotalMedals').val();
	var countryid=$rowId.replace('r','');
	var countries={"countryName": $updatedCountryName,"gold": $updatedGoldMedals,"silver": $updatedSilverMedals,"bronze": $updatedBronzeMedals,"total":$updatedTotalMedals};
	$.ajax({
		type:'PUT',
		data:countries,
		url:'http://localhost:3000/countries/'+countryid,
		success:function(){
			$('#'+countryid+'ed').fadeToggle();			

			alert("Updated");
			$('#'+countryid+'r').html("<td class='country' data-target='#myModal1'><a href='#'>"+$updatedCountryName+
				"</a></td><td>"+$updatedGoldMedals+
				"</td><td>"+$updatedSilverMedals+
				"</td><td>"+$updatedBronzeMedals+
				"</td><td>"+$updatedTotalMedals+
				"</td><td><span class='glyphicon glyphicon-edit' id='"+countryid+"e'>&nbsp</span><span class='glyphicon glyphicon-trash' id='"+countryid+"'></span></td></tr>");
			$('#'+countryid+'er').html("<td colspan='6' id='"+countryid+"ed'></td>");
			$('#'+countryid+'er').hide();
		},
		error:function()
		{
			alert("Error Happen");
		}

	})
};

//Player modal and all
$('.tableCountry').on('click','.country',showPlayer);

function showPlayer()
{
	$.ajax({
		type:'GET',
			url:'http://localhost:3000/players/?countryName='+this.innerText,
			success:function(data)
			{
				if(data.length===0)
				{
					modalPlayer.modal('hide');
					alert("Player didn't Exist for this Country");
				}
				else
				{
					$('#playerTable').empty();
					appendPlayerTableHeader(data);
				}
			},
			error:function()
			{
				alert("Error Happen");
			}

		});

};
//Players table and moodal
function appendPlayerTableHeader(data)
{
	$('#playerTable').append("<thead><tr><th>Player Name</th><th>Gender</th> <th>Phone</th> <th>Age</th> <th>Sport</th><th>Medal</th></tr></thead>");		
	appendPlayerTableRows(data);

};

function appendPlayerTableRows(data)
{
	$.each(data,function(i,player){
		$('#playerTable').append("<tr id='"+player.id+"r'><td><a href='#'>"+player.name+
			"</a></td><td>"+player.gender+
			"</td><td>"+player.phone+
			"</td><td>"+player.age+
			"</td><td>"+player.sport+
			"</td><td>"+player.medal+
			"</td></tr>");
	});
	modalPlayer.modal('show');

};

//Infinite Scrolling
$(window).scroll(function(){
	if ($(window).scrollTop() == $(document).height()-$(window).height()){
		counter+=20;
		$.ajax({
			type:'GET',
			url:'http://localhost:3000/countries/?_start='+counter+'&_limit='+limit,
			success:function(data)
			{
				appendTableRows(data);
			},
			error:function()
			{
				alert("Error Happen");
			}
		});
	}
});



//pagination content(for this uncomment footer comment)
//this one is last child of pager
/*$('.pagination').on('click','li:nth-child(6)',function()
{
	var start=$('#pager-ul li:nth-child(2)')[0].innerText;
	var end=$('#pager-ul li:nth-child(5)')[0].innerText;
	if(start==length/2)
	{
		alert("This is last Page");
	}
	else
	{
		$('#pager-ul').html('<li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li><li><a href="#">'+(parseFloat(start)+4)+
			'</a></li><li><a href="#">'+(parseFloat(start)+5)+
			'</a></li><li><a href="#">'+(parseFloat(start)+6)+
			'</a></li><li><a href="#">'+(parseFloat(start)+7)+
			'</a></li><li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');
	}
});

//this one is first child of pager
$('.pagination').on('click','li:nth-child(1)',function()
{
	var start=$('#pager-ul li:nth-child(2)')[0].innerText;
	var end=$('#pager-ul li:nth-child(5)')[0].innerText;

	if(start==1)
	{
		alert("This is the First Page");
	}
	else
	{
		$('#pager-ul').html('<li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li><li><a href="#">'+(parseFloat(start)-4)+
			'</a></li><li><a href="#">'+(parseFloat(start)-3)+
			'</a></li><li><a href="#">'+(parseFloat(start)-2)+
			'</a></li><li><a href="#">'+(parseFloat(start)-1)+
			'</a></li><li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');
	}
});


//this one is for pager
$('.pagination').on('click','li',function(){
	if(!isNaN(this.innerText))
	{
		console.log("yess");
		counter=20*(this.innerText-1);
		getNextTable(counter);
	}
});
*/
});
