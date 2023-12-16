const layout = require('../layout')

module.exports = products => {
  const renderedProducts = products
    .map(product => {
      return `
        <div class="column is-one-quarter">
          <div class="card product-card">
            <figure>
            </figure>
            <div class="card-content">
              <h3 class="subtitle">${product.title}</h3>
              <h5> Price: $${product.price}</h5>
              <h5> Quantity ${product.quantity}</h5>           
              </div>
              <figure>
              <img src="data:image/png;base64, ${product.image}"/>
            </figure>
            <footer class="card-footer">
              </form>
            </footer>
          </div>
        </div>
      `
    })
    .join('\n')

  return layout({
    content: `
      
      <section>
        <div class="container">
          <div class="columns">
            <div class="column "></div>
            <div class="column is-four-fifths">
              <div>
                <h2 class="title text-center">Shopping Cart</h2>
                <div class="columns products">
                  ${renderedProducts}  
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
