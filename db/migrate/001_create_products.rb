class CreateProducts < ActiveRecord::Migration[5.1]
  def self.up
    create_table :products do |t|
      t.string :name, null: false
      t.integer :price, null: false
      t.timestamps null: false
    end
  end

  def self.down
    drop_table :products
  end
end
