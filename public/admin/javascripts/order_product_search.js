(function() {

  var autocompleteProducts = function(e) {
    var search = $(this);
    var input = search.val();
    if (input.length > 0) {
      var url = search.data('url');
      $.ajax({
        url: url,
        data: {q: input},
        type: 'GET',
        dataType: 'json',
        success: renderProductSearchResults,
      })
      showProductResultContainer();
    } else {
      emptyProductResultContainer();
      hideProductResultContainer();
    }
  }

  var renderProductSearchResults = function(results, status) {
    var resultContent = "";
    if (results.length > 0) {
      for(result_index in results) {
        var result = results[result_index];
        var productInfo;
        if (result.identifier == '') {
          productInfo = `${result.name}`
        } else {
          productInfo = `${result.identifier} | ${result.name}`
        }
        var dataAttributes = `data-product=${btoa(JSON.stringify(result))}`
        resultContent = resultContent + `<div class='product-result search-result' ${dataAttributes}>${productInfo}</div>`
      }
    } else {
      resultContent = "<div>Keine Produkte gefunden</div>"
    }
    $('#product-search-results').html(resultContent);
  }

  var addOrderItem = function() {
    hideProductResultContainer();
    emptyProductSearchInput();
    removeOtherNewItemStates();
    var product = JSON.parse(atob($(this).data('product')))
    if ($("#order-item-"+product.id).length == 0) {
      var item = orderItem(product);
      $("#order-items").append(item);
    } else {
      $("#order-item-"+product.id).removeClass('deleted');
    }
    row = $(".order-items").find("#order-item-"+product.id+"");
    row.addClass('new-item');
  }

  var emptyProductSearchInput = function() {
    $("#product-search").val("");
  }

  var emptyProductResultContainer = function() {
    $("#product-search-results").empty();
  }

  var showProductResultContainer = function() {
    $('#product-search-results').removeClass('hidden');
  }

  var hideProductResultContainer = function() {
    $('#product-search-results').addClass('hidden');
  }

  var removeOtherNewItemStates = function() {
    $(".order-items .order-item").removeClass('new-item');
  }

  var orderItem = function(product) {
    var orderItemHTML =
      `<tr class="order-item" id="order-item-${product.id}">` +
      `<td class="col-md-1 delete-action"><a class="fa fa-times delete-item" href="#"></a></td>` +
      `<td class="col-md-1 identifier">${product.identifier}</td>` +
      `<td class="col-md-4 name">${product.name}</td>` +
      `<td class="col-md-1 quantity text-right form-group">` +
      `<input type="hidden" name="order[order_items_attributes][${product.id}][product_id]" id="order_order_items_attributes_${product.id}_product_id" value="${product.id}"</input>` +
      `<input type="text" name="order[order_items_attributes][${product.id}][quantity]" id="order_order_items_attributes_${product.id}_quantity" class="quantity_input form-control text-right">` +
      `</td>` +
      `<td class="col-md-1 price">` +
      `<input type="text" name="order[order_items_attributes][${product.id}][price]" value="${product.price_f}" id="order_order_items_attributes_${product.id}_price" class="price_input form-control text-right">` +
      `</td>` +
      `<td class="col-md-2 total-price text-right">0</td>` +
      `</tr>`
    return orderItemHTML
  }

  $(document).ready(function() {
    $("#product-search").on('keyup', autocompleteProducts);
    $("#product-search").focus(showProductResultContainer).blur(hideProductResultContainer);

    $("#order-form").off('mousedown', addOrderItem)
    $("#order-form").on('mousedown', '.product-result', addOrderItem)
  });
})();
