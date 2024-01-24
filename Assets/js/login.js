

var btn = document.getElementById('loginbtn')
console.log(btn);







btn.addEventListener('click', (event) => {
    event.preventDefault()
    const email = document.getElementById('typeEmailX').value;
    const password = document.getElementById('typePasswordX').value;
    console.log(email, password);
    const emailError = document.getElementById('errorElement1');
    const passwordError = document.getElementById('passwordErr');

    const form = btn.form;
    console.log("Form element:", form);

    let EmailErrMessage = []
    let PasswordErrMessage = []

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)&&email.trim() !== '') {
        EmailErrMessage.push('Invalid email format');
      }


    if (email.trim() === '') {
        EmailErrMessage.push('This field is required')
    }
    if (password.trim() === '') {
        PasswordErrMessage.push('This field is required')
    }

    if(EmailErrMessage.length>0){

        document.getElementById('typeEmailX').classList.add('is-invalid') 
        document.getElementById('typeEmailX').classList.remove('s-valid')
    }else{

        document.getElementById('typeEmailX').classList.remove('is-invalid')
        document.getElementById('typeEmailX').classList.add('is-valid')

    }


    if(PasswordErrMessage.length>0){

        document.getElementById('typePasswordX').classList.add('is-invalid') 
        document.getElementById('typePasswordX').classList.remove('is-valid')
    }else{
              
        document.getElementById('typePasswordX').classList.remove('is-invalid')
        document.getElementById('typePasswordX').classList.add('is-valid')

    }





 
   


    emailError.innerText = EmailErrMessage.join(',')
    passwordError.innerText = PasswordErrMessage.join(',');
    if (PasswordErrMessage.length === 0 && EmailErrMessage.length === 0) {
        form.submit();
    }

})