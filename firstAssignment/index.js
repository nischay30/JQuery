$(function(){

	var $btnsearch = $('#btnSearch')

	$btnsearch.on('click',function()
	{
		var $movieName=$('#movieName').val();
		var $movieTable= $('#movieTable');
		var $movieNotFound=$('#movieNotFound');
		if($movieName.trim().length>1)
		{
			$.ajax({
				type:'GET',
				url:'http://www.omdbapi.com/?s='+$movieName,
				success:function(data)
				{
					$movieTable.empty();
					$movieNotFound.empty();
					if(data.Response==="True")
					{
						$movieTable.addClass('table-responsive table-hover table-bordered');
						$movieTable.append('<thead><tr><th>Poster</th> <th>Movie Title</th> <th>Movie Year</th> <th>ImdbID</th></tr></thead><tbody>');
						$.each(data.Search,function(i,movieName)
						{

							$movieTable.append('<tr><td><img src='+movieName.Poster+' alt="Image not available" class="img-responsive"></td><td>'+movieName.Title+'</td><td>'+movieName.Year+'</td><td>'+movieName.imdbID+'</td></tr>');
						});
													$movieTable.append('</tbody>');
					}
					else
					{
						$movieNotFound.html('<h2>Movie Not Found</h2>')
					}
				}

			});
		}
		else
		{
			alert("Please Enter Movie Name");
			$movieTable.empty();
			$movieNotFound.empty();
		}

	});
});