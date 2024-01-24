
var btn=document.getElementById('btn')
console.log(btn);

const productName = document.getElementById('pName').value;
const brandName = document.getElementById('bName').value;
const subTitle = document.getElementById('subTitle').value;
const descriptionHeading = document.getElementById('dHeading').value;
const description = document.getElementById('Des').value;
const firstPrice = document.getElementById('firstprice').value;
const lastPrice = document.getElementById('lastprice').value;
const discount = document.getElementById('discount').value;
const color = document.getElementById('color').value;
const inStock = document.getElementById('iStock').value;
const image = document.getElementById('img').value;
const errorElement1 = document.getElementById('errorElement1');
const errorElement2 = document.getElementById('errorElement2');
const errorElement3 = document.getElementById('errorElement3');
const errorElement4 = document.getElementById('errorElement4');
const errorElement5 = document.getElementById('errorElement5');
const errorElement6 = document.getElementById('errorElement6');
const errorElement7 = document.getElementById('errorElement7');
const errorElement8 = document.getElementById('errorElement8');
const errorElement9 = document.getElementById('errorElement9');
const errorElement10 = document.getElementById('errorElement10');
const errorElement11 = document.getElementById('errorElement11');


btn.addEventListener('click',(event)=>{
    event.preventDefault()

    if(productName===''){
        console.log("hiiiiiii");
    }
   
})