$(document).ready(function(){

    var tekst;
    var kljuc='&key=' + config.mojKljuc;
    var apiUrl="https://www.googleapis.com/books/v1/volumes?q=";
    var tip="";
    var max=10;
    var start=0;
    var ukupanBroj=0;
    var redosled="";
    var img="";
    var urlimg="";

    $("#pretraga").submit(function(event){
        cleanData();
        tekst=$("#pretraga input:text").val();
        if($("#tip").val()=="Author"){
            tip="+inauthor:";
        }
        else if($("#tip").val()=="Title"){
            tip="+intitle:";
        }
        else{
            tip="";
        }

        if($("#redosled").val()=="Relevance"){
            redosled="";
        }
        else if($("#redosled").val()=="Publish Date"){
            redosled="&orderBy=newest";
        }
        else{
            redosled="";
        }
        if(tekst==""){
            cleanTotalResults();
            cleanBooks();
            cleanPagination();
            cleanData();
            $("#rezultatiTekst").append("Vaša pretraga je bila neuspešna, molimo vas pokušajte ponovo!");
        }
        else{
            requestBooks(tekst,start,max,tip,redosled);
            }

            event.preventDefault();
        

    }); 

    function requestBooks(tekst,start,max,tip,redosled){
        var zahtev=new XMLHttpRequest();
        var url=apiUrl+tip+tekst+kljuc+"&startIndex="+start+"&maxResults="+max+redosled;
        zahtev.open('GET', url,true);
        zahtev.send();
        zahtev.addEventListener("readystatechange",processRequest,false);

        function processRequest(e){
            if(zahtev.readyState==4 && zahtev.status==200){
                var odgovor=JSON.parse(zahtev.responseText);
                displayTotalResults(odgovor);
                displayResults(odgovor);
                createPagination(odgovor);
            }
        }
    }

    function createPagination(odgovor){
        cleanPagination();
        ukupanBroj = odgovor.totalItems;
       
        if (start== 0 && ukupanBroj>max){
            prethodni = start;
            start =start + max; 
            $("#pagination").prepend("<a href='#' id='sledecaStranica'> Sledeća stranica</a>");
            
            $("#sledecaStranica").click(function() {
                requestBooks(tekst,start,max,tip,redosled);
                $('html, body').animate({ scrollTop: 0 }, 'slow');
                event.preventDefault();
            });

        }
        else{
          
            if (start !=0 && start < ukupanBroj && odgovor.items.length == max){
                cleanPagination();
                $("#pagination").prepend("<a href='#' id='prethodnaStranica'>Prethodna stranica </a><a href='#' id='sledecaStranica'>Sledeća stranica</a>");
                
                $("#sledecaStranica").click(function() {
                    start =start + max;
                    requestBooks(tekst,start,max,tip,redosled);
                    $('html, body').animate({ scrollTop: 0 }, 'slow'); 
                    event.preventDefault();
                });
                
                $("#prethodnaStranica").click(function() {
                    start =start - max;
                    requestBooks(tekst,start,max,tip,redosled);
                    $('html, body').animate({ scrollTop: 0 }, 'slow');
                    event.preventDefault();
                });
            }else{	if(start !=0){
				cleanPagination();
				
				$("#pagination").prepend("<a href='#' id='prethodnaStranica'>Prethodna stranica</a>");
				$("#prethodnaStranica").click(function() {
					start =start - max;
					requestBooks(tekst,start,max,tip,redosled);
					$('html, body').animate({ scrollTop: 0 }, 'slow'); 
					event.preventDefault();
		});}
			}
	}
}

function cleanPagination(){
	$("#pagination").empty();
}


function displayTotalResults(odgovor){
	cleanTotalResults();
	
	$("#rezultatiTekst").prepend("Broj rezultata je: <b>"+ odgovor.totalItems +"</b>");
}

function displayResults(odgovor){
	cleanBooks();
	for (i=0;i<odgovor.items.length;i++){
				console.log(odgovor.items[i].volumeInfo.title)
				$("#rezultati").append("<div class ='naslovKnjige'>Naslov:</div>");
				$("#rezultati").append("<div class ='naslov'>"+odgovor.items[i].volumeInfo.title+"</div>");
				$("#rezultati").append("<div class ='imeAutoraKnjige'>Autor:</div>");
				$("#rezultati").append("<div class ='autor'>"+odgovor.items[i].volumeInfo.authors+"</div>");
				$("#rezultati").append("<div class ='datumIzdavanjaKnjige'>Datum izdavanja:</div>");
                $("#rezultati").append("<div class ='datumIzdavanja'>"+odgovor.items[i].volumeInfo.publishedDate+"</div>");
                img = $('<img class="slika"><br><a href=' + odgovor.items[i].volumeInfo.infoLink + '><button id="imagebutton">Prikaži više</button></a>'); 	
                urlimg= odgovor.items[i].volumeInfo.imageLinks.thumbnail;
                img.attr('src', urlimg);
                img.appendTo('#rezultati');
                $("#rezultati").append("<p>\n\n\n\n\n\n\n</p>");
			}
} 


function cleanTotalResults(){
	$("#rezultatiTekst").empty();
}


function cleanBooks(){
	$("#rezultati").empty();
}	


function cleanData(){
	tekst ="";
	tip=""; 
	start = 0;
	prethodni = 0;
}

});

    

