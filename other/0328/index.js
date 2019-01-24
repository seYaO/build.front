//1.打开数据库
var datatable = null;
var db = openDatabase('MyData', '', 'My Database', 102400);
//2.初始化
function init(){
	datatable = document.getElementById("datatable");
	showAllData();
}
//3.擦除表格中当前显示的数据
function removeAllData(){
	for(var i = datatable.childNodes.length - 1; i >= 0; i--){
		datatable.removeChild(datatable.childNodes[i]);
	}
	var tr = document.createElement('tr');
	var th1 = document.createElement('th');
	var th2 = document.createElement('th');
	var th3 = document.createElement('th');
	th1.innerHTML = '姓名';
	th2.innerHTML = '留言';
	th3.innerHTML = '时间';
	tr.appendChild(th1);
	tr.appendChild(th2);
	tr.appendChild(th3);
	datatable.appendChild(tr);
}
//4.显示数
function showData(row){
	var tr = document.createElement('tr');
	var td1 = document.createElement('td');
	td1.innerHTML = row.name;
	var td2 = document.createElement('td');
	td2.innerHTML = row.message;
	var td3 = document.createElement('td');
	var t = new Date();
	t.setTime(row.time);
	td3.innerHTML = t.toLocaleDateString() + " " + t.toLocaleTimeString();
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	datatable.appendChild(tr);
}
//5.显示全部数据  integer  datetime
function showAllData(){
	db.transaction(function(tx){
		tx.executeSql('create table if not exists MsgData(name text, message text, time datetime)', []);
		tx.executeSql('select * from MsgData', [], function(tx, rs){
			removeAllData();
			for(var i = 0; i < rs.rows.length; i++){
				showData(rs.rows.item(i));
			}
		});
	});
}
//6.追加数据
function addData(name, message, time){
	db.transaction(function(tx){
		tx.executeSql('insert into MsgData values(?, ?, ?)', [name, message, time], function(tx, rs){
			alert("成功保存数据！");
		}, function(tx, err){
			alert(err.source + ": " + err.message);
		});
	});
}
//6.删除数据
function deleteData(name, message, time){
	db.transaction(function(tx){
		tx.executeSql('delete from MsgData where name = 123', [], function(tx, rs){
			alert("删除数据！");
		}, function(tx, err){
			alert(err.source + ": " + err.message);
		});
	});
}
//7.保存数据
function saveData(){
	var name = document.getElementById('name').value;
	var memo = document.getElementById('memo').value;
	var time = new Date().getTime();
	addData(name, memo, time);
	showAllData();
}

