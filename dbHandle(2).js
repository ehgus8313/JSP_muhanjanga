var db = null;
var var_no = null;
var position = null;
var index;
 
// 데이터베이스 생성 및 오픈
function openDB(){
   db = window.openDatabase('muhanjDB', '1.0', '장어DB', 1024*1024); 
   console.log('1_DB 생성...'); 
} 
// 테이블 생성 트랜잭션 실행
function createTable() {
   db.transaction(function(tr){
   var createSQL = 'create table if not exists guest1(peoplenumber text, name text, phonenumber text, time text)';       
   tr.executeSql(createSQL, [], function(){
     		console.log('2_1_테이블생성_sql 실행 성공...');        
	   }, function(){
	      console.log('2_1_테이블생성_sql 실행 실패...');            
	   });
	   }, function(){
	      console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
	   }, function(){
	      console.log('2_2_테이블 생성 트랜잭션 성공...');
     });
 } 
 // 데이터 입력 트랜잭션 실행
 function insertBook(){ 
    db.transaction(function(tr){
  		var peoplenumber = $('#bookpeoplenumber1').val();
  		var name = $('#bookName1').val();
		var phonenumber = $('#bookphonenumber1').val();
		var time = $('#booktime1').val();
  		var insertSQL = 'insert into guest1(peoplenumber, name, phonenumber, time) values(?, ?, ?, ?)';      
     	tr.executeSql(insertSQL, [peoplenumber, name, phonenumber, time], function(tr, rs){    
      	    console.log('3_ 책 등록...no: ' + rs.insertId);
	        alert('예약자 ' + $('#bookName1').val() + ' 이 예약되었습니다');      	       
	   		$('#bookName1').val(''); 
			$('#booktime1').val(''); 
			$('#bookphonenumber1').val('');			
			$('#bookpeoplenumber1').val('미정').attr('selected', 'selected'); 
			$('#bookpeoplenumber1').selectmenu('refresh');		   		   	      
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
    });      
 }
// 전체 데이터 검색 트랜잭션 실행
function listBook(){
  db.transaction(function(tr){
 	var selectSQL = 'select * from guest1';    
  	tr.executeSql(selectSQL, [], function(tr, rs){    
       console.log(' 책 조회... ' + rs.rows.length + '건.');
       if (position == 'first') {
       	  if(index == 0) 
       	  	alert('더 이상의 도서가 없습니다');   
          else       	
          	index = 0;
	   	 }
       else if (position == 'prev') {
       	  if(index == 0) 
       	  	alert('더 이상의 도서가 없습니다');   
          else
          	index = --index;
	 		 }
       else if (position == 'next') {
       	  if(index == rs.rows.length-1) 
       	  	alert('더 이상의 도서가 없습니다');          	
		      else
		      	index = ++index;
       }
       else 
       {  
       	  if(index == rs.rows.length-1) 
       	  	alert('더 이상의 도서가 없습니다');          	
		      else       	
	       	  index = rs.rows.length-1;
       }
       $('#bookpeoplenumber4').val(rs.rows.item(index).peoplenumber);
	   $('#bookphonenumber4').val(rs.rows.item(index).phonenumber);
       $('#bookName4').val(rs.rows.item(index).name);
	   $('#booktime4').val(rs.rows.item(index).time);
 		});   
  });           
}
// 데이터 수정 트랜잭션 실행
function updateBook(){
    db.transaction(function(tr){
    	var peoplenumber = $('#bookpeoplenumber2').val();
    	var new_name = $('#bookName2').val();
    	var old_name = $('#sBookName2').val();
		var new_phonenumber = $('#booksphonenumber2').val();
    	var old_phonenumber = $('#sBookphonenumber2').val();
		var updateSQL = 'update guest1 set peoplenumber = ?, name = ?, phonenumber = ? where name = ? and phonenumber = ?';          
     	tr.executeSql(updateSQL, [peoplenumber, new_name, old_name, new_phonenumber, old_phonenumber], function(tr, rs){    
	         console.log('5_책 수정.... ') ;
	         alert('예약자 ' + $('#sBookName2').val() + ' 예약이 수정되었습니다');   	         
	   		 $('#bookName2').val(''); $('#sBookName2').val(''); 
			 $('#bookphonenumber2').val(''); $('#sBookphonenumber2').val('');			 
	   		 $('#bookpeoplenumber2').val('미정').attr('selected', 'selected'); 
			 $('#bookpeoplenumber2').selectmenu('refresh');	
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
    });       
}
// 데이터 삭제 트랜잭션 실행
function deleteBook(){
   db.transaction(function(tr){
	  var name = $('#sBookName3').val(); 
	  var phonenumber = $('#sBookphonenumber3').val();
 	  var deleteSQL = 'delete from guest1 where name = ? and phonenumber = ?';
	  //var deleteSQL = 'delete from guest1 where phonenumber = ?';      
	  tr.executeSql(deleteSQL, [name, phonenumber], function(tr, rs){    
	     console.log('6_책 삭제... ');   
	     alert('예약자 ' + $('#bookName3').val() +' 예약이 삭제되었습니다');   	     
	   	 $('#bookpeoplenumber3').val(''); $('#bookName3').val(''); $('#sBookName3').val(''); $('#booknumber3').val(''); $('#sBookphonenumber3').val(''); $('#booktime3').val('')
		  	     
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
   });         
} 
// 데이터 수정 위한 데이터 검색 트랜잭션 실행
/*
function selectBook2(name){
   db.transaction(function(tr){
	 var selectSQL = 'select peoplenumber, name, phonenumber from guest1 where name=?';        
  	 tr.executeSql(selectSQL, [name], function(tr, rs){
  	 	 $('#bookpeoplenumber2').val(rs.rows.item(0).peoplenumber).attr('selected', 'selected'); 	
	 		 $('#bookpeoplenumber2').selectmenu('refresh');	
       $('#bookName2').val(rs.rows.item(0).name);
	   $('#bookphonenumber2').val(rs.rows.item(0).phonenumber);
	 	});
   });         
}
*/

// 데이터 수정 위한 데이터 검색 트랜잭션 실행

function selectBook2(name, phonenumber){
   
   console.log('name=' + name + 'phonenumber=' + phonenumber);
   
   db.transaction(function(tr){
	 var selectSQL = 'select name, phonenumber,peoplenumber from guest1 where name=? and phonenumber=?';        
  	 tr.executeSql(selectSQL, [name, phonenumber], function(tr, rs){
		 console.log('조회... ' + rs.rows.length + '건.');
  	 	 $('#bookpeoplenumber2').val(rs.rows.item(0).peoplenumber).attr('selected', 'selected'); 	
	 		 $('#bookpeoplenumber2').selectmenu('refresh');
       $('#bookName2').val(rs.rows.item(0).name);
	   $('#bookphonenumber2').val(rs.rows.item(0).phonenumber);
	 	});
   });         
}

// 데이터 삭제 위한 데이터 검색 트랜잭션 실행
function selectBook3(name, phonenumber){
   db.transaction(function(tr){
 	 var selectSQL = 'select peoplenumber, name, phonenumber, time from guest1 where name=? and  phonenumber=?';      
		tr.executeSql(selectSQL, [name, phonenumber], function(tr, rs){ 
			 $('#bookpeoplenumber3').val(rs.rows.item(0).peoplenumber);
       $('#bookName3').val(rs.rows.item(0).name);
	   $('#bookphonenumber3').val(rs.rows.item(0).phonenumber);
	   $('#booktime3').val(rs.rows.item(0).time);
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
	});         
}
// 데이터 조건 검색 트랜잭션 실행
function selectBook4(name, phonenumber){
   db.transaction(function(tr){
 	 var selectSQL = 'select peoplenumber, name, phonenumber, time from guest1 where name=? and phonenumber=?';      
  	 tr.executeSql(selectSQL, [name,phonenumber], function(tr, rs){ 
         $('#bookpeoplenumber4').val(rs.rows.item(0).peoplenumber);
         $('#bookName4').val(rs.rows.item(0).name);
		 $('#bookphonenumber4').val(rs.rows.item(0).phonenumber);
		 $('#booktime4').val(rs.rows.item(0).time);
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
   });         
 };
