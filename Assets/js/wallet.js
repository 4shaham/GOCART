

$(document).ready(function () {

    $('.addWallet').submit(function (e) {

        e.preventDefault();

        alert('ol')
        console.log('hiiii');
        var formData = $(this).serialize();
        console.log(formData);

        $.ajax({
            url: '/api/addWalletAmt',
            type: 'POST',
            data: formData,
            success: function (res) {
                console.log(res.Message);


                var options = {
                    "key": res.key_id, // Enter the Key ID generated from the Dashboard
                    "amount": res.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    "currency": "INR",
                    "name": "Acme Corp",
                    "description": "Test Transaction",
                    "image": "https://example.com/your_logo",
                    "order_id": res.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                    "callback_url": "http://localhost:8880/api/WalletrayzorPayment-verification",
                    "prefill": {
                        "name": "Gaurav Kumar",
                        "email": "gaurav.kumar@example.com",
                        "contact": "9000090000"
                    },
                    "notes": {
                        "address": "Razorpay Corporate Office"
                    },
                    "theme": {
                        "color": "#3399cc"
                    }
                };
                var rzp1 = new Razorpay(options);
                rzp1.open();


            }, error: function (xhr, status, error) {

                console.error('Request failed:', status, error);
            }
        })


    })





})    