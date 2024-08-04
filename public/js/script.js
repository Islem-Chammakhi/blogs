document.addEventListener('DOMContentLoaded',()=>{
    const allButtons=document.querySelectorAll('.searchBtn');
    const searchBar=document.querySelector('.searchBar');
    const searchInput=document.getElementById('#searchInput');
    const searchCloseButton=document.querySelector('#searchClose');
    for(var i=0;i<allButtons.length;i++){
        allButtons[i].addEventListener('click',()=>{
            searchBar.style.visibility='visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded','true');
            searchInput.focus();
        })
    }
    searchCloseButton.addEventListener('click',()=>{
        searchBar.style.visibility='hidden';
        searchBar.classList.remove('open')
    })
})