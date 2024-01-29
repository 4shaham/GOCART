function saveChanges() {
  const checkedCheckbox = document.querySelector(".ii:checked");

  if (checkedCheckbox) {
    const selectedAddressId = checkedCheckbox.value;
    console.log(selectedAddressId);
    // Update the form action attribute with the selected address ID

    document.getElementById(
      "addressForm"
    ).action = `/api/checkoutAddressChange?id=${selectedAddressId}`;

    // Optional: Log the updated form action
    console.log(
      "Updated Form Action:",
      document.getElementById("addressForm").action
    );

    // Submit the form (if needed)
    document.getElementById("addressForm").submit();
  } else {
    alert("Please select an address.");
  }
}

$(document).ready(function () {
  $(".pay-form").submit(function (e) {
    e.preventDefault();

    var formData = $(this).serialize();
    console.log(formData);

    $.ajax({
      url: "/api/payment",
      type: "POST",
      data: formData,
      success: function (res) {
        console.log(res.Message);
        if (res.Message == "cash on delivery") {
          window.location.href = res.url;
        } else {
          var options = {
            key: res.key_id, // Enter the Key ID generated from the Dashboard
            amount: res.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "Acme Corp",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: res.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            callback_url:
              "/api/rayzorPayment-verification",
            prefill: {
              name: "Gaurav Kumar",
              email: "gaurav.kumar@example.com",
              contact: "9000090000",
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#3399cc",
            },
          };
          var rzp1 = new Razorpay(options);
          rzp1.open();
        }
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          // $('small').html = xhr.responseText
          var PaymentFormValidation = document.getElementById(
            "paymentFormValidation"
          );
          console.log(xhr.responseText);
          PaymentFormValidation.innerText = xhr.responseText;
        } else if (xhr.status === 405) {
          var Address = document.getElementById("ds");
          console.log(xhr.responseText);
          Address.innerText = xhr.responseText;
        } else if (xhr.status == 400) {
          console.log(xhr.responseText);
          var stockValidation = document.getElementById("OutOfStock");
          stockValidation.innerText = xhr.responseText;
        }
        console.error("Request failed:", status, error);
      },
    });
  });
});

var applyForm = document.getElementById("appllyform");

applyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let coupen = document.getElementById("pa");

  let error = document.getElementById("error");

  let errMessage = [];

  console.log("hgloooo by gia m shubam");

  if (coupen.value.trim() === "") {
    errMessage.push("Enter the valid coupen code");
  }

  var a = document.getElementById("total-display").innerText;

  if (a == 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "your amount will be 0",
    });
  }

  error.innerText = errMessage.join(",");

  if (errMessage.length === 0 && a != 0) {
    let data = {};
    Array.from(applyForm).forEach((Element) => {
      data[Element.name] = Element.value;
    });
    $.ajax({
      url: "/api/coupenManagment",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (response) {
        // Handle success

        // alert(`Congratulations! You received a ${response.discountPercentage} % discount.`)

        // console.log('Request successful:', response);
        // var coupendiscount=response.discountPercentage

        // console.log(coupendiscount);
        // discount(coupendiscount)

        var discountPercentage = response.discountPercentage;
        var maxRedimabelAmount = response.maxRedimabelAmount;
        console.log(maxRedimabelAmount);

        Swal.fire(
          `Congratulations! You received a ${discountPercentage}% discount`
        );

        var removeBtn = document.getElementById("removeCoupon");
        removeBtn.style.display = "block";

        var applaybtn = document.getElementById("applayBtn");
        applaybtn.style.display = "none";

        // Call your discount function
        discount(discountPercentage, maxRedimabelAmount);
      },
      error: function (xhr, status, error) {
        // Handle error
        var valid = document.getElementById("validErr");
        if (xhr.status === 404) {
          $("small").html = xhr.responseText;
          console.log(xhr.responseText);
          valid.innerText = xhr.responseText;
        } else if (xhr.status === 400 && xhr.responseText == "above") {
          console.log("samanway");

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "purchase order above 10,000",
          });
        } else if (xhr.responseText == "agiain") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "you already used this",
          });
        }
        console.error("Request failed:", status, error);
      },
    });
  }
});

function removeCoupen() {
  var removeBtn = document.getElementById("removeCoupon");
  removeBtn.style.display = "none";

  var applaybtn = document.getElementById("applayBtn");
  applaybtn.style.display = "block";

  var tPrice = document.getElementById("tPrice");
  var totalValue = parseFloat(tPrice.innerText);

  var dPrice = document.getElementById("dPrice");
  var discountValue = parseFloat(dPrice.innerHTML);

  var calculatedTotal = totalValue - discountValue;

  document.getElementById("discountCoupon-display").innerHTML = "";
  document.getElementById("total-display").innerHTML = calculatedTotal;
  document.getElementById("totalPrice").value = Number(calculatedTotal);
  document.getElementById("coupenFormTotalPrice").value =
    Number(calculatedTotal);
}

var tPrice = document.getElementById("tPrice");
var totalValue = parseFloat(tPrice.innerText);
// console.log(totalValue);

var dPrice = document.getElementById("dPrice");
var discountValue = parseFloat(dPrice.innerHTML);

var calculatedTotal = totalValue - discountValue;
console.log(calculatedTotal);

function discount(ss, s) {
  var CoupendiscountTotal = (calculatedTotal * ss) / 100;
  if (CoupendiscountTotal > s) {
    console.log("hiiiiiiidis", s);
    document.getElementById("discountCoupon-display").innerHTML = s;
    document.getElementById("total-display").innerHTML = calculatedTotal - s;
    document.getElementById("totalPrice").value = Number(calculatedTotal - s);
  } else {
    console.log(CoupendiscountTotal);
    document.getElementById("discountCoupon-display").innerHTML =
      CoupendiscountTotal;
    document.getElementById("total-display").innerHTML =
      calculatedTotal - CoupendiscountTotal;
    document.getElementById("totalPrice").value = Number(
      calculatedTotal - CoupendiscountTotal
    );
  }
}

document.getElementById("total-display").innerHTML = calculatedTotal;
document.getElementById("totalPrice").value = Number(calculatedTotal);
document.getElementById("coupenFormTotalPrice").value = Number(calculatedTotal);

function closeModal() {
  var modal = document.getElementById("discountModal");
  modal.parentElement.removeChild(modal);
}

// function  wallet(){

//   alert('ok')

//   var walletBalance=document.getElementById('walletBalance').value
//   console.log('hiii',walletBalance);

// }


var walletBtn = document.getElementById("walletBtn");

walletBtn.addEventListener("click", (e) => {
  e.preventDefault();
  var w = document.getElementById("walletBalance");
  var value = document.getElementById("total-display").innerText;
  const walletBalance = w.innerText;
  console.log(walletBalance, value);

  var formData = {
    walletBalance: walletBalance,
    productPrice: value,
    // Add other data properties if needed
  };

  $.ajax({
    url: "/api/p",
    type: "POST",
    data: formData,
    success: function (response) {
      Swal.fire(`your wallet payment successes`);
      console.log(walletBalance - value);
      const v = value - walletBalance;
      if (v > 0) {
        document.getElementById("total-display").innerHTML = v;
        document.getElementById("total-display").innerHTML = v;
        document.getElementById("totalPrice").value = Number(v);
      } else {
        document.getElementById("totalPrice").value = 0;
        document.getElementById("total-display").innerHTML = 0;
      }
      if (walletBalance - value < 0) {
        w.innerHTML = 0;
      } else {
        w.innerHTML = walletBalance - value;
      }

      // walletCalculation()
    },
    error: function (xhr, status, error) {},
  });
});

// function walletCalculation(){

//   document.getElementById("total-display").innerHTML =
//   document.getElementById("totalPrice").value = 1;

// }
