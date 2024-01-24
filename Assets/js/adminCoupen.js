
console.log('hiii')



var form = document.getElementById('coupenManagmentFormSubmit')





form.addEventListener('submit', (event) => {
  event.preventDefault();
  let coupenCode = document.getElementById('coupen code');
  let discount = document.getElementById('discount');
  let expire = document.getElementById('Expire');
  let purchaseMAximumAmount = document.getElementById('maxPurchase');
  

 

  

  let errorElement1 = document.getElementById('errorElement1');
  let errorElement2 = document.getElementById('errorElement2');
  let errorElement3 = document.getElementById('errorElement3');
  let errorElement4 = document.getElementById('errorElement4');
 

  let coupenErrMessage = []
  let discountErrMessage = []
  let expireErrMessage = []
  let purchaseMAximumAmountErrMessage = []
  

  if (coupenCode.value.trim() === '') {
    coupenErrMessage.push('This Field is required')

  }
  if (discount.value.trim() === '') {
    discountErrMessage.push('This Field is required')
  }
  if (expire.value.trim() === '') {
    expireErrMessage.push('This Field is required')
  }
  if (purchaseMAximumAmount.value.trim() === '') {
    purchaseMAximumAmountErrMessage.push('This Field is required')
  }
 
  // if (status.value.trim() === '') {
  //   statusErrMessage.push('This Field is required')
  // }


 

  errorElement1.innerText = coupenErrMessage.join(', ');
  errorElement2.innerText = discountErrMessage.join(', ');
  errorElement3.innerText = expireErrMessage.join(', ');
  errorElement4.innerText = purchaseMAximumAmountErrMessage.join(', ');
  

  if (coupenErrMessage.length === 0 && discountErrMessage.length === 0 && expireErrMessage.length === 0 ) {

    form.submit()
       
  }

})



