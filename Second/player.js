$(function(){

	var startpage=0;
	var startlimit=10;
	var lastpage=100000;

	$countrytable= $('#countrytable');
	$modalbody=$('#modalbody');
	$btnAdd=$('#btnAdd');
	$modal=$('.modal');


	$("#first").on('click',function(){
		getNextTable('first');
	});

	$("#next").on('click',function(){
		getNextTable('next');
	});
	$("#previous").on('click',function(){
		getNextTable('prev');
	});
	$("#last").on('click',function(){
		getNextTable('last');
	});


		$('#search').on('click',getRow);			//to search by country Name
		$('#form1').on('submit',addRow);			//to add a row

		(function getTable(startp)
		{
			$.ajax({
				type:'GET',
				url:'http://localhost:3000/countries/?_start='+startpage+'&_limit='+startlimit,
				success:function(data){
					$countrytable.empty();
					$countrytable.append("<thead><tr><th>Country Name</th><th>Gold Medals</th> <th>Silver Medals</th> <th>Bronze Medals</th> <th>Total Medals</th><th>Operations</th></tr></thead>")


					$.each(data,function(i,country){
						$countrytable.append("<tr id='"+country.id+"r'><td class='country'><a href='#'>"+country.countryName.toUpperCase()+
							"</a></td><td>"+country.gold+
							"</td><td>"+country.silver+
							"</td><td>"+country.bronze+
							"</td><td>"+country.total+
							"</td><td><span class='glyphicon glyphicon-edit' id='"+country.id+"e'>&nbsp</span><span class='glyphicon glyphicon-trash' id='"+country.id+"'></span></td></tr>");
						$countrytable.append("<tr class='updaterow' id='"+country.id+"er'><td colspan='6' id='"+country.id+"ed'></td></tr>");
						$('#'+country.id+'er').hide();
					});

			$('.glyphicon-trash').on('click',deleteRow);  //delete call
			$('.glyphicon-edit').on('click',showRow);
		}

	});
		})();

//GET Command for Next All
function getNextTable(pager)

{
	console.log(pager);
	if(pager==='next')
	{
		startpage=startpage+10;
	}
	else if(pager==='prev')
		startpage=startpage-10;
	else if(pager==='first')
		startpage=0;
	else if(pager==='last')
		startpage=lastpage-10;


	if(startpage<0)
	{
		alert("This is the First Page");
		startpage=startpage+10;
	}
	else if(startpage>=lastpage)
	{
		alert("This is the Last Page");
		startpage=startpage-10;
	}
	else
	{
		$.ajax({
			type:'GET',
			url:'http://localhost:3000/countries/?_start='+startpage+'&_limit='+startlimit,
			success:function(data){
				$countrytable.empty();
				$countrytable.append("<thead><tr><th>Country Name</th><th>Gold Medals</th> <th>Silver Medals</th> <th>Bronze Medals</th> <th>Total Medals</th><th>Operations</th></tr></thead>")


				$.each(data,function(i,country){
					$countrytable.append("<tr id='"+country.id+"r'><td class='country'><a href='#'>"+country.countryName.toUpperCase()+
						"</a></td><td>"+country.gold+
						"</td><td>"+country.silver+
						"</td><td>"+country.bronze+
						"</td><td>"+country.total+
						"</td><td><span class='glyphicon glyphicon-edit' id='"+country.id+"e'>&nbsp</span><span class='glyphicon glyphicon-trash' id='"+country.id+"'></span></td></tr>");
					$countrytable.append("<tr class='updaterow' id='"+country.id+"er'><td colspan='6' id='"+country.id+"ed'></td></tr>");
					$('#'+country.id+'er').hide();
				});

			$('.glyphicon-trash').on('click',deleteRow);  //delete call
			$('.glyphicon-edit').on('click',showRow);
		}

	});
	}
};


//Post Command to add row
function addRow(e)
{
	e.preventDefault();
	console.log("time")
	$inputName=$('#inputName').val().toLowerCase();
	$inputGold=$('#inputGold').val();
	$inputSilver=$('#inputSilver').val();
	$inputBronze=$('#inputBronze').val();
	$total=parseFloat($inputGold)+parseFloat($inputSilver)+parseFloat($inputBronze);
	var countries={"countryName": $inputName,"gold": $inputGold,"silver": $inputSilver,"bronze": $inputBronze,"total":$total};
	$.ajax({
		type:'POST',
		data:countries,
		url:'http://localhost:3000/countries',
		success:function(){
			$modal.modal('toggle');
			$('#form1')[0].reset();
		}	
	})

};

function showRow()
{

	$rowId=$(this.id);
	$rowId=$rowId.selector.trim().replace('e','r');
	
	$tdId=$('#'+this.id+'d');

	$('.updaterow').hide();

	$('#'+this.id+'r').fadeToggle();
	$tdId.html("<div><label>Country Name</label><input type='text' id='updatedCountryName' value='"+$('#'+$rowId).find('td:first')[0].innerText+
		"'><br><label>Gold Medals</label><input type='text' id='updatedGoldMedals' value='"+$('#'+$rowId).find('td:nth-child(2)')[0].innerText+
		"'><br><label>Silver Medals</label> <input type='text' id='updatedSilverMedals' value='"+$('#'+$rowId).find('td:nth-child(3)')[0].innerText+
		"'><br><label>Bronze Medals</label> <input type='text' id='updatedBronzeMedals' value='"+$('#'+$rowId).find('td:nth-child(4)')[0].innerText+
		"'><br><label>Total Medals</label> <input type='text' id='updatedTotalMedals' value='"+$('#'+$rowId).find('td:nth-child(5)')[0].innerText+"'</div>");
	$tdId.append("<button class='btn-danger btn-large' id='updateBtn'>Update</button>");


	$('#updateBtn').on('click',updateRow);
};



function updateRow()
{
	$updatedCountryName=$('#updatedCountryName').val().toLowerCase();
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
			$('#'+countryid+'ed').hide();			
			alert("Updated");
		}	
	})

};


//Get Command to search One row
function getRow(){
	$countryName=$('#countryName').val().toLowerCase();
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
					$countrytable.append("<thead><tr><th>Country Name</th><th>Gold Medals</th> <th>Silver Medals</th> <th>Bronze Medals</th> <th>Total Medals</th><th>Operations</th></tr></thead>")
					$.each(data,function(i,country){

						$countrytable.append("<tr id='"+country.id+"r'><td class='country'><a href='#'>"+country.countryName.toUpperCase()+
							"</a></td><td>"+country.gold+
							"</td><td>"+country.silver+
							"</td><td>"+country.bronze+
							"</td><td>"+country.total+
							"</td><td><span class='glyphicon glyphicon-edit' id='"+country.id+"e'>&nbsp</span><span class='glyphicon glyphicon-trash' id='"+country.id+"'></span></td></tr>");
						$countrytable.append("<tr><td colspan='6' id='"+country.id+"ed'></td></tr>");
						$('#'+country.id+'ed').hide();
					});
			$('.glyphicon-trash').on('click',deleteRow);  //delete call
			$('.glyphicon-edit').on('click',showRow);

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
			alert("Deleted");

		}
	});
}

});
