function presentData(data) {
    data.map((item) => {
        nasdaqLi.innerHTML += `<li style="list-style: none;">
      <a href="./company.html?symbol=${item.symbol}" target="_blank">${item.name} ${item.symbol}</a>
    </li>`
    })
    spinner.style.display = 'none';
    //console.log(data)
}