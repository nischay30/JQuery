$(function(){

	var counter=0;
	var limit=20;
	var length=0;

	$countrytable= $('#countrytable');
	$modalbody=$('#modalbody');
	$btnAdd=$('#btnAdd');
	$modal=$('.modal');


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



//function is used to get the length of the data
	(function getLength()
	{

		$.ajax({
			type:'GET',
			url:'http://localhost:3000/countries',
			success:function(data){
				length=data.length;
			}

		});
	})();


//Starting funciton to show the table
function getTable()
{
	$first.show();
	$last.show();

	$('#pager-ul').show();

	counter=0;
	$.ajax({
		type:'GET',
		url:'http://localhost:3000/countries/?_start='+counter+'&_limit='+limit,
		success:function(data)
		{
			$countrytable.empty();
			appendTableHeader(data);
		}

	});
};


//function used to append table header 
function appendTableHeader(data)
{
	$countrytable.append("<thead><tr><th>Country Name</th><th>Gold Medals</th> <th>Silver Medals</th> <th>Bronze Medals</th> <th>Total Medals</th><th>Operations</th></tr></thead>");		
	appendTableRows(data);

};

//fucntion to append Table Rows
function appendTableRows(data)
{
	$.each(data,function(i,country){
		$countrytable.append("<tr id='"+country.id+"r'><td class='country'><a href='#'>"+country.countryName+
			"</a></td><td>"+country.gold+
			"</td><td>"+country.silver+
			"</td><td>"+country.bronze+
			"</td><td>"+country.total+
			"</td><td><span class='glyphicon glyphicon-edit' id='"+country.id+"e'>&nbsp</span><span class='glyphicon glyphicon-trash' id='"+country.id+"'></span></td></tr>");
		$countrytable.append("<tr class='updaterow' id='"+country.id+"er'><td colspan='6' id='"+country.id+"ed'></td></tr>");
		$('#'+country.id+'er').hide();
	});
};



//function to show the contents of table
function getNextTable(counter)
{
	$.ajax({
		type:'GET',
		url:'http://localhost:3000/countries/?_start='+counter+'&_limit='+limit,
		success:function(data){
			$countrytable.empty();
			appendTableHeader(data);
		}
	});
	
};

//Get Command to search One row
function getRow(){
	$countryName=$('#countryName').val();
	hidePager();

	$countrytable.empty();
	if($countryName.trim().length===0)
	{
		alert("Please Enter Country Name to search");
	}
	else
	{
		$.ajax({
			type:'GET',
			url:'http://localhost:3000/countries/?countryName='+$countryName,
			success:function(data){
				if(data.length===0)
				{
					alert("Country Didn't exist int the Json File");
				}
				else
				{
					appendTableHeader(data);
				}
			}
		});
	}
};

//Delete Row Function
function deleteRow()
{
	$('#'+this.id+'er').remove();
	$('#'+this.id+'r').remove();
	$.ajax({
		type:'DELETE',
		url:'http://localhost:3000/countries/'+this.id,
		success:function(){
			length -=1;
		}
	});
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
		success:function(country){
			var data1=[country];

			length +=1;
			$modal.modal('toggle');
			$('#form1')[0].reset();
			appendTableRows(data1);
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
			$tdId.html("<div><label>Country Name</label><input type='text' required id='updatedCountryName' value='"+$('#'+$rowId).find('td:first')[0].innerText+
				"'><br><label>Gold Medals</label><input type='text' id='updatedGoldMedals' value='"+$('#'+$rowId).find('td:nth-child(2)')[0].innerText+
				"'><br><label>Silver Medals</label> <input type='text' id='updatedSilverMedals' value='"+$('#'+$rowId).find('td:nth-child(3)')[0].innerText+
				"'><br><label>Bronze Medals</label> <input type='text' id='updatedBronzeMedals' value='"+$('#'+$rowId).find('td:nth-child(4)')[0].innerText+
				"'><br><label>Total Medals</label> <input type='text' id='updatedTotalMedals' value='"+$('#'+$rowId).find('td:nth-child(5)')[0].innerText+"'</div>");
			$tdId.append("<button class='btn-info btn-large' id='updateBtn'>Update</button><button class='btn-danger btn-large' id='closeBtn'>Close</button>");
			$('#updateBtn').on('click',updateRow);
			$('#closeBtn').on('click',function(){
				$('.updaterow').hide();

			});
		};



//Put Command
function updateRow()
{
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
			$('#'+countryid+'r').html("<td class='country'><a href='#'>"+$updatedCountryName+
				"</a></td><td>"+$updatedGoldMedals+
				"</td><td>"+$updatedSilverMedals+
				"</td><td>"+$updatedBronzeMedals+
				"</td><td>"+$updatedTotalMedals+
				"</td><td><span class='glyphicon glyphicon-edit' id='"+countryid+"e'>&nbsp</span><span class='glyphicon glyphicon-trash' id='"+countryid+"'></span></td></tr>");
			$('#'+countryid+'er').html("<td colspan='6' id='"+countryid+"ed'></td>");
			$('#'+countryid+'er').hide();
		}	
	})
};


//complete


//Infinite Scrolling
$(window).scroll(function(){
	if ($(window).scrollTop() == $(document).height()-$(window).height()){
		counter+=20;
		$.ajax({
			type:'GET',
			url:'http://localhost:3000/countries/?_start='+counter+'&_limit='+limit,
			success:function(data)
			{
			//	$countrytable.empty();
			appendTableRows(data);
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
