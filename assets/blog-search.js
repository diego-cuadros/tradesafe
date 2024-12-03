class PredictiveSearchBlog extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector(
      "#predictive-search-blog"
    );

    this.input.addEventListener(
      "input",
      this.debounce((event) => {
        this.onChange(event);
      }, 300).bind(this)
    );
  }

  onChange() {
    const searchTerm = this.input.value.trim();

    if (!searchTerm.length) {
      document.getElementById("blog-list").style.display = "block";
      document.getElementById("predictive-search-blog").innerHTML = "";
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  }

  getSearchResults(searchTerm) {
    fetch(
      `/search/suggest?q=${searchTerm}&resources[type]=article&section_id=blog-search`
    )
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }
        //console.log(response.text());
        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, "text/html")
          .querySelector("#shopify-section-blog-search").innerHTML;

        //console.log(resultsMarkup);
        //this.predictiveSearchResults.innerHTML = resultsMarkup;

        var keyword = `<h3>Search results for "${searchTerm}"</h3>`;
        //$('#predictive-search').html(keyword+resultsMarkup);

        document.getElementById("blog-list").style.display = "none";
        document.getElementById("predictive-search-blog").innerHTML =
          keyword + resultsMarkup;

        this.open();
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  open() {
    document.getElementById("blog-list").style.display = "none";
    //alert('open');
    //$('#blog-list').hide();
  }

  close() {
    document.getElementById("blog-list").style.display = "block";
    //alert('close');
    //$('#blog-list').show();
  }

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}
customElements.define("predictive-search", PredictiveSearchBlog);

/*
  $(document).ready(function() {
      
      $("#Search").on("input",function(){
          
          if($(this).val() == ''){
            $('#predictive-search-results').show();
            $('#predictive-search-results').html('');
          }
              
      });
      
  });
  */
