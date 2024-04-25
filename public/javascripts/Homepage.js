// Pdf upload k liye
document.querySelector("#pdf-upload").addEventListener("click", function () {
    document.querySelector("#uploadform input").click();
})

document.querySelector("#uploadform input").addEventListener("change", function () {
    document.querySelector("#uploadform").submit();
})


// Notes section k liye

var arr = [
    { icon: "/images/edit.png", name: "Computer Networks", des: "Lorem ipsum dolor sit amet,dunt ut labore et dolore magna aliqua." },
    { icon: "/images/edit.png", name: "DSA", des: "Lorem ipsum dolor sit amet,dunt ut labore et dolore magna aliqua." },
    { icon: "/images/edit.png", name: "Python", des: "Lorem ipsum dolor sit amet,dunt ut labore et dolore magna aliqua." },
    { icon: "/images/edit.png", name: "Numerical Analysis", des: "Lorem ipsum dolor sit amet,dunt ut labore et dolore magna aliqua." },
    { icon: "/images/edit.png", name: "Operating System", des: "Lorem ipsum dolor sit amet,dunt ut labore et dolore magna aliqua." },
    { icon: "/images/edit.png", name: "Digital System", des: "Lorem ipsum dolor sit amet,dunt ut labore et dolore magna aliqua." },
    { icon: "/images/edit.png", name: "Analog Electronics", des: "Lorem ipsum dolor sit amet,dunt ut labore et dolore magna aliqua." },
    { icon: "/images/edit.png", name: "Advanced Algo", des: "Lorem ipsum dolor sit amet,dunt ut labore et dolore magna aliqua." },
    { icon: "/images/edit.png", name: "AI", des: "Lorem ipsum dolor sit amet,dunt ut labore et dolore magna aliqua." },
    { icon: "/images/edit.png", name: "AI", des: "Lorem ipsum dolor sit amet,dunt ut labore et dolore magna aliqua." },
    { icon: "/images/edit.png", name: "AI", des: "Lorem ipsum dolor sit amet,dunt ut labore et dolore magna aliqua." },
]

function enterNote() {
    var clutter = "";
    arr.forEach(function (elem, index) {
        clutter += `<div class="box">
        <img src="${elem.icon}" alt="">
        <h1>
            ${elem.name}
        </h1>
        <p>${elem.des}</p>
    </div>`;
    })

    document.querySelector(".notes-container").innerHTML = clutter;
}

enterNote();


//login 
const wrapper = document.querySelector('.wrapper')
const loginLink = document.querySelector('.login-link')
const registerLink = document.querySelector('.register-link')
const btnPopup = document.querySelector('.login-button')
const closePopup = document.querySelector('.icon-close')

registerLink.addEventListener('click',()=>{
    wrapper.classList.add('active');
})

loginLink.addEventListener('click',()=>{
    wrapper.classList.remove('active');
})

btnPopup.addEventListener('click',()=>{
    wrapper.classList.add('active-popup');
})

closePopup.addEventListener('click',()=>{
    wrapper.classList.remove('active-popup');
})