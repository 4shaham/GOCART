
// console.log("hiiii");

// const btn=document.querySelector('.savech')

// btn.addEventListener('click',()=>{
    
//     const id=btn.getAttribute('data-id')

//     const form=document.getElementById('editAddress')
//     console.log(form);
//     console.log(id);
//     alert(id)

//     $.ajax({
//         url: `http://localhost:8880/api/editAddress?id=${id}`,
//         method: 'PUT',
//         success: function (data,TextStatus,xhr) { 
//         if(xhr.status=== 200){
//             console.log(data)
//         }    
       
//         },
//         error: function (xhr) {
//             if(xhr.status===404){
//                 console.error('Error:', xhr.responseText);
//             }
            
//         }
//     });
// })

// document.addEventListener("DOMContentLoaded", function () {
//     document.querySelector(".savech").addEventListener("click", function () {
//         // Get form data
//         var formData = new FormData(document.getElementById("editAddress"));
//         console.log(formData);
//         // Get the address ID from data-id attribute
//         var addressId = this.getAttribute("data-id");
//         console.log(addressId);


//         $.ajax({
//                     url: `http://localhost:8880/api/editAddress?id=${addressId}`,
//                     method: 'PUT',
//                     data:formData,
//                     success: function (data,TextStatus,xhr) { 
//                     if(xhr.status=== 200){
//                         console.log(data)
//                     }    
                   
//                     },
//                     error: function (xhr) {
//                         if(xhr.status===404){
//                             console.error('Error:', xhr.responseText);
//                         }
                        
//                     }
//                 });

        // // Perform AJAX request
        // fetch("api/editAddress?id=" + addressId, {
        //     method: "PUT",
        //     body: formData,
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         // Handle success (optional)
        //         console.log("Success:", data);
        //     })
        //     .catch(error => {
        //         // Handle errors (optional)
        //         console.error("Error:", error);
        //     });

        
//     });
// });