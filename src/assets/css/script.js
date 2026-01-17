// lấy ra element của trang
const formRegister = document.getElementById("formRegister");
const userNameElement=document.getElementById("userName");
const emailElement=document.getElementById("email");
const passwordElement=document.getElementById("password");
const rePasswordElement=document.getElementById("rePassword");
const addressElement=document.getElementById("address");

//element liên quan đến lỗi
const userNameError=document.getElementById("useNameError");
const emailError=document.getElementById("emailError");
const passwordError=document.getElementById("passwordError");
const rePasswordError=document.getElementById("rePasswordError");

//lắng nghe sự kiện submit form đăng kí tài khoản
formRegister.addEventListener("submit",function(e){
//ngăn chặn sự kiện load lại trang
   e.preventDefault();

  //validate dữ liệu đầu vào 
   if (!userNameElement.value) {
    //hiển thị lỗi
    userNameError.style.display="block";
   }
}); 