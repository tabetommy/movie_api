const http=require('http');
const url=require('url');
const fs=require('fs');
const port=8080;

http.createServer((request,response)=>{
    const urlAddress=request.url;
    const q=url.parse(urlAddress,true);
    let filePath='';
    const appendedData='URL'+ urlAddress + '\nTimestamp:' + new Date() + '\n\n';
    fs.appendFile('log.txt',appendedData,(err)=>{
        if(err){
            console.log(err)
        }else{
            console.log('Added to log')
        }
    });

    if (q.pathname.includes('documentation')){
        filePath=(__dirname + 'documentation.html');
        console.log('filepath 1:',filePath)
    }else{
        filePath='index.html';
        console.log(filePath)
    }

    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log(err)
        }
        response.writeHead(200,{'Content-Type':'text/plain'});
        response.write(data);
        response.end()
    })
}).listen(port)

console.log('My server is running  on port 8080')