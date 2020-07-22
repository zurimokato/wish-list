var express= require('express');
var cors=require('cors');
var app= express();

app.use(cors());
app.use(express.json());

app.listen(3000, ()=>console.log("Server running on port 3000"));
var ciudades=['Paris', 'Barcelona','Barranquilla','Montevideo',
'Santiago de Chile','Mexico DF','Nueva York'];

app.get('/ciudades',(req,res,next)=>res.json(ciudades.filter((c)=>c.toLowerCase().indexOf(req.query.q.toString())>-1)));
app.get('/api/translation',(req, res,next)=>res.json({lang:req.query.lang, key:'Hola '+req.query.lang}));

var misDestinos=[];
app.get('/my', (req,res,next)=>res.json(misDestinos));
app.post('/my', (req,res,next)=>{
    console.log(req.body.nevo);
    misDestinos.push(req.body.nuevo);
    res.json(misDestinos);
})
