Chleehof::Admin.controllers :products do

  get :search do
    if params[:q].present?
      @products = Product.search(params[:q]).ordered
      render 'products/index'
    else
      redirect(url(:products, :index))
    end
  end

  get :index do
    @products = Product.ordered
    render 'products/index'
  end

  get :new do
    @product = Product.new
    render 'products/new'
  end

  post :create do
    @product = Product.new(params[:product])
    if @product.save
      flash[:success] = "#{@product} wurde gespeichert"
      redirect(url(:products, :index))
    else
      flash.now[:error] = "#{@product} konnte nicht gespeichert werden"
      render 'products/new'
    end
  end

  get :edit, :with => :id do
    @product = Product.find(params[:id])
    if @product
      render 'products/edit'
    else
      flash[:warning] = "Produkt wurde nicht gefunden"
      halt 404
    end
  end

  put :update, :with => :id do
    puts params.inspect
    @product = Product.find(params[:id])
    if @product
      if @product.update_attributes(params[:product])
        flash[:success] = "#{@product} wurde angepasst"
        redirect(url(:products, :index))
      else
        flash.now[:error] = "#{@product} konnte nicht angepasst werden"
        render 'products/edit'
      end
    else
      flash[:warning] = "Produkt wurde nicht gefunden"
      halt 404
    end
  end

  delete :destroy, :with => :id do
    product = Product.find(params[:id])
    if product
      if product.destroy
        flash[:success] = "#{product} wurde gelöscht"
      else
        flash[:error] = "#{product} konnte nicht gelöscht werden"
      end
      redirect url(:products, :index)
    else
      flash[:warning] = "Produkt wurde nicht gefunden"
      halt 404
    end
  end
end
