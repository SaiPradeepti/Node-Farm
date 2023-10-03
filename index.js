const fs = require('node:fs')
const http = require('node:http')
const url = require('node:url');


const replaceTemplate = (temp,product) => {
    let output = temp.replaceAll(`{%PRODUCTNAME%}`, product.productName);
  output = output.replaceAll(`{%IMAGE%}`, product.image);
  output = output.replaceAll(`{%PRICE%}`, product.price);
  output = output.replaceAll(`{%FROM%}`, product.from);
  output = output.replaceAll(`{%NUTRIENTS%}`, product.nutrients);
  output = output.replaceAll(`{%QUANTITY%}`, product.quantity);
  output = output.replaceAll(`{%DESCRIPTION%}`, product.description);
  output = output.replaceAll(`{%ID%}`, product.id);

  if (!product.organic) {
    output = output.replaceAll(`{%NOT_ORGANIC%}`, "not-organic");
  }
  return output;
}
const tempOverview = fs.readFileSync(`${__dirname}/templates/template_overview.html`,'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template_card.html`,'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template_product.html`,'utf-8')


const data = fs.readFileSync(`${__dirname}/data.json`,'utf-8')
const dataObj = JSON.parse(data);

const server = http.createServer((req,res) => {
    const {query, pathname} = url.parse(req.url);
    console.log(req.url)
    // Overview Page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'Content-type': 'text/html'})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replaceAll('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(output)        
    } 
    // Product Page
    else if(pathname === '/product'){
        res.writeHead(200,{'Content-type': 'text/html'})
        const product = dataObj[req.url[req.url.length-1]]
        console.log(req.url[req.url.length-1])
        console.log(dataObj[req.url[req.url.length-1]])
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
        // res.end(product)
    }
    //API
    else if(pathname === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)
    }
    //Not Found
    else{
        res.writeHead(400,{'Content-type': 'text/html'})
        res.end('<h1>Page not found!</h1>')
    }
})

server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening...')
})