
let currentPage;

function updateCurrentPage(pageNo){
    document.getElementById("currentPage").innerText = pageNo;
}

window.onload = ()=>{
      console.log('Load')
      currentPage = parseInt(new URLSearchParams(window.location.hash).get('gsc.page')) || 0;
      updateCurrentPage(currentPage);
      updateExtBtn()

    // document
    //   .querySelectorAll(".gsc-expansionArea")
    //   .addEventListener("change", (e) => {
    //     let results = document.querySelectorAll(".gs-result");
    //     console.log(results);
    //   });
}

function updateHash(){
    let params = Object.fromEntries(new URLSearchParams(window.location.hash));
        params['gsc.page'] = currentPage;
        window.location.hash = `#gsc.tab=${params['#gsc.tab']}&gsc.q=${params['gsc.q']}&gsc.page=${params['gsc.page']}`
}

function prevPage(){
    if(currentPage > 1){
        currentPage -= 1;
        updateCurrentPage(currentPage);
        updateHash();
        
    }

    return;

}

function nextPage(){
    currentPage += 1;
    updateCurrentPage(currentPage)
    updateHash();
}

function updateExtBtn(){
    document.getElementById("ext-query").innerHTML = new URLSearchParams(window.location.search).get('q');
}

window.addEventListener('hashchange', e=>{
    updateExtBtn();
});
