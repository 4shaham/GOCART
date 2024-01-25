// $(document).ready(function () {

// var quantitySelect = document.querySelectorAll('#quantity')

//     quantitySelect.forEach((qtyselected)=>{

//       qtyselected.addEventListener('change',function(e){

//         e.preventDefault();

//         var href=$(this).attr('data-Url')
//         var quantity= qtyselected.value

//         console.log(href);

//       })

//     })

//   })
function changeQuantity(amount) {
  const quantityInput = document.getElementById("quantity");
  let newQuantity = parseInt(quantityInput.value) + amount;
  newQuantity = newQuantity < 1 ? 1 : newQuantity; // Ensure quantity is at least 1

  // Update the input field value
  quantityInput.value = newQuantity;

  // You may want to perform additional actions here, such as triggering an API call
  // Example: updateQuantity(newQuantity);
}

$(document).ready(function () {
  var quantitySelect = document.querySelectorAll("#quantity");

  quantitySelect.forEach((qtyselected, index) => {
    qtyselected.addEventListener("change", function (e) {
      if (parseInt(quantitySelect[index].value) >= 1) {
        e.preventDefault();
        var href = document
          .querySelectorAll(".quantity")
          [index].getAttribute("data-Url");
        var quantity = qtyselected.value;
        console.log(quantity);
        console.log(href);
      } else {
        quantitySelect[index].value = "1";
      }

      $.ajax({
        url: `${href}&qty=${quantity}`,
        method: "Post",
        success: function (data) {
          if (data.message == "outOfStock") {
            // window.location.href=data.url
          }
          location.reload();
          console.log("Data:", data);
        },
        error: function (error) {
          console.error("Error:", error);
        },
      });
    });
  });
});

// var firstprice=document.querySelectorAll('#quantity')

// firstprice.forEach((firstpriceSelected,index)=>{

//    var a=firstpriceSelected.[index].value
//    console.log(a);

// })

var discountTotalElement = document.getElementById("discounttotal-display");
var discountTotalValue = parseFloat(discountTotalElement.innerText);

var subTotalElement = document.getElementById("subtotal-display");
var subTotalValue = parseFloat(subTotalElement.innerText);

var calculatedTotal = subTotalValue - discountTotalValue;
console.log(calculatedTotal);

document.getElementById("total-display").innerHTML = calculatedTotal;

function confirmRemoval(productId) {
  // Set the href attribute of the "Remove" button in the modal
  $("#deleteLink").attr("href", "/api/removeCart?id=" + productId);

  // Show the modal
  $("#confirmationModal").modal("show");
}

// Update the content of the element
