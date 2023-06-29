function Header() {
  return (
    <div className="row">
      <div>Hello Friend I'm a basic React Component!</div>
      <div id="graphqlSection">
        <button className="btn btn-success text-nowrap " id="pingPong" onClick={PingToServer}>
          Ping To Server
        </button>
        <div id="resultDiv" style={{display: "none"}}>
          {/* <ProductList products={[]} style={{display: "none"}} /> */}
        </div>
      </div>
    </div>
  );
}
function Product({item}) {
  return (
    <>
    <span>ID : {item.id}</span>----
    <span>Name : {item.name}</span>----
    <span>Price : {item.price}</span>----
    <span>Count : {item.count | 0 }</span>-----
    </>
  )
}
function ProductList({items}) {
  let [products, setProducts] = React.useState([]);
  let [initialized, setInit] = React.useState(false);
  let [isLoaded, setLoaded] = React.useState(false);
  if(!initialized) {
    init();
  }
  let productsItems = products.map((product,index) => (<li key={index}><Product item={product}/></li>));
  function sort() {
    let sortedProducts = products.sort((a,b) => (
      b.price - a.price 
    ));
    setProducts(Object.assign([],sortedProducts));
  }
  function sortByCount() {
    let sortedProducts = products.sort((a,b) => (
      b.count - a.count
    )); 
    setProducts(Object.assign([], sortedProducts));
  }
  function sortByName() {
    let sortedProducts = [...products].sort((a,b) => (
      a.name > b.name ? 1 : -1
    ));
    setProducts(Object.assign([],sortedProducts));
  }
  function init() {
    setProducts(items);
    setInit(true);
    setLoaded(true);
  }

  function getProducts() {
    const url = "http://localhost:3200/graphql";
    // let resultDiv = document.getElementById("xResult");
    // resultDiv.innerHTML = "Loading ....";
    setLoaded(false);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "query": `query {
          getProducts {
            id,name,price,count
          }
        }`,
      }),
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => { 
        console.log(result.data);
        setProducts(result.data.getProducts);
        setInit(true);
        setLoaded(true);
     })
    .catch((error) => {
      setError(error);
    });
  }
  let content; 
  if(isLoaded !== true) {
    content = <div>LOADING .... </div>;
  }else {
    content = <div id="xResult">
    <ul>{productsItems}</ul>
    </div>;
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-1">
          <button className="btn btn-primary" onClick={getProducts}>Refresh</button>
        </div>
        <div className="col-1">
          <button className="btn btn-info" onClick={sort}>Sort</button>
        </div>
        <div className="col-2">
          <button className="btn btn-danger text-nowrap " onClick={sortByCount}>Sort By Count</button>
        </div>
        <div className="col-3">
          <button className="btn btn-success text-nowrap" onClick={sortByName}>Sort By Name</button>
        </div>
      </div>
      <div className="row">
        {content}
      </div>
    </div>
  );
}
function PingToServer() {
  const url = "http://localhost:3200/graphql";
  let resultDiv = document.getElementById("resultDiv");
  document.getElementById("resultDiv").style.display = "block";
  resultDiv.innerHTML = "Loading ....";
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "query": `query {
        getProducts {
          id,name,price
        }
      }`,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((result) => { 
      console.log(result.data);
        let products = result.data.getProducts;
        ReactDOM.render(<ProductList style={{display: "block"}} items={products}/>,
         document.getElementById("resultDiv"));
     })
    .catch((error) => {
      console.log(error);
    });
}
function HomePage() {
  return (
    <>
      <Header />
      <br />
      <div>------------------------</div>
      <Greeting />
    </>
  );
}

function Greeting() {
  let [message, setMessage] = React.useState("LOADING MESSAGE ....!");
  let [isLoaded, setLoaded] = React.useState(false);
  let [error, setError] = React.useState(null);
  let [init, setInit] = React.useState(false);
  function getMessage() {
    console.log("xxx");
    const url = `http://localhost:3200/graphql`;
    setLoaded(false);
    setMessage("LOADING ....");
    fetch(url, {
      method : "Post",
      headers : {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "query": `query {
          greeting
        }`,
      }),
    }).then(res => res.json())
    .then(result => {
      console.log(result);
      setMessage(result.data.greeting);
      setLoaded(true);
    }).catch((error) => {
      console.log(error);
      setError(error);
    });
  }
  function initialize() {
      const url = `http://localhost:3200/graphql`;
      fetch(url, {
        method : "Post",
        headers : {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "query": `query {
            greeting
          }`,
        }),
      }).then(res => res.json())
      .then(result => {
        setMessage(result.data.greeting);
        setLoaded(true);
        setInit(true);
      }).catch((error) => {
        setError(error);
      });
  }
  if(init == false) {
    initialize();
  }
  let content;
  if(isLoaded !== false) {
    content = <div>{message}</div>;
  }else if (error !== null) {
    content = <div>{error}</div>;
  }
  return (
    <>
      <button onClick={getMessage}>Refresh</button>
      <br />
      {content}
    </>
  );
}

ReactDOM.render(<HomePage />, document.getElementById("app"));
