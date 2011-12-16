var http = require('http');
var fs = require('fs');
var vm = require('vm');

var host = {
    addr: '127.0.0.1',
    port: 8070
};

var jsonExport = {
    title: 'Мой первый парсер',
    list: [
        {name:'Первый пункт списка', msg:'это только начало'},
        {name:'Следующий', msg:'продолжение'},
        {name:'Третий', msg:'и так сколько пожелаете!'}
    ]
};

var server = http.createServer(function (request, response) {
    response.writeHead(200, {'content-type':'text/html; charset=utf-8'});
    fs.readFile('./template.html', function (err, data) {
        var data = data.toString();
        var dataArr = data.match(/\<script type=(nodejs|'nodejs'|"nodejs")\>([^]+?)<\/script\>/gim);
        for (var i=0; i<(dataArr.length||0); i++) {
            var code = dataArr[i].replace(/^\<script([^\>]+)\>([^]+?)<\/script\>$/im, '$2');
            data = data.replace(/\<script type=(nodejs|'nodejs'|"nodejs")\>([^]+?)<\/script\>/im,
                vm.runInNewContext(code, jsonExport));
        }
        response.end(data);
    });
});

server.listen(host.port, host.addr);
console.log('Сервер успешно запущен: '+host.addr+':'+host.port);