const layout = require('../layout')

module.exports = CartView => {
  const grandTotal = CartView.reduce(
    (accum, product) => accum + product.price * product.quantity,
    0
  )

  const renderedCartView = CartView.map(product => {
    return `
        <div class="column is-one-quarter">
          <div class="card product-card">
            <figure>
            </figure>
            <div class="card-content">
              <h3 class="subtitle">${product.title}</h3>
              <h5 class="title text-center"> Price: $${product.price}</h5>
              <h5 class="title text-center"> Quantity: ${product.quantity}</h5>           
              <h5 class="title text-center"> Sub--total ${product.quantity * product.price}</h5>           
              </div>
              <figure>
              <img src="data:image/png;base64, ${product.image}"/>
              <td>
              <form method = 'POST' action = "/cart/${product.id}/delete">
              <button class="button is-links">Delete</button>
              </form>
              </td>
              </figure>
            <footer class="card-footer">
              </form>
            </footer>
          </div>
        </div>
      `
  }).join('\n')

  return layout({
    content: `
      <section>
        <div class="container">
          <div class="columns">
            <div class="column "></div>
            <div class="column is-four-fifths">
              <div>
                <h2 class="title text-center">Shopping Cart</h2>
                <h1 class="title text-center"> GRAND TOTAL: ${grandTotal} </h1>  
                <div class="columns CartView">
                  ${renderedCartView}  
                </div>
              </div>
            </div>
            <div class="column "></div>
          </div>
        </div>
      </section>
    `
  })
}
