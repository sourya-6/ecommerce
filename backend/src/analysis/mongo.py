from pymongo import MongoClient
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import zscore
# Connect to MongoDB
def connect_to_mongodb(uri, db_name):
    try:
        client = MongoClient(uri)
        db = client[db_name]
        print("✅ Connected to MongoDB")
        return db
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {e}")
        return None

# Fetch data from a collection
def fetch_collection_data(db, collection_name):
    try:
        collection = db[collection_name]
        data = list(collection.find())
        print(f"📦 Fetched {len(data)} records from '{collection_name}'")
        return pd.DataFrame(data)
    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        return pd.DataFrame()
    


def clean_products_data(products_df):
    print("\n🧹 Cleaning & Preprocessing Data:")

    # 1. Null Handling
    initial = len(products_df)
    products_df.dropna(subset=['brand', 'price', 'stock'], inplace=True)
    print(f"🗑️ Removed {initial - len(products_df)} records with nulls in brand/price/stock")

    # 2. Type Conversion (if applicable)
    if 'createdAt' in products_df.columns:
        products_df['createdAt'] = pd.to_datetime(products_df['createdAt'])
        print("⏳ Converted 'createdAt' to datetime")

    # 3. Outlier Detection
    if 'price' in products_df.columns:
        before = len(products_df)
        products_df = products_df[(abs(zscore(products_df['price'])) < 3)]
        print(f"📉 Removed {before - len(products_df)} outliers in 'price'")

    return products_df


# Analyze top brands
def analyze_top_brands(products_df):
    print("\n📊 Top Brands Analysis:")
    if 'brand' in products_df.columns:
        brand_counts = products_df['brand'].value_counts()
        print(brand_counts)

        # Visualization
        plt.figure(figsize=(10,6))
        sns.barplot(x=brand_counts.index, y=brand_counts.values, palette="Set2")
        plt.title("Top Brands by Product Count")
        plt.xlabel("Brand")
        plt.ylabel("Number of Products")
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig("top_brands.png")
        plt.show()
    else:
        print("⚠️ Column 'brand' not found.")

# Analyze category-wise product count
def analyze_category_product_count(products_df):
    print("\n📊 Category-wise Product Count:")
    if 'category' in products_df.columns:
        category_counts = products_df['category'].value_counts()
        print(category_counts)

        # Visualization
        plt.figure(figsize=(8,6))
        category_counts.plot.pie(autopct='%1.1f%%', startangle=90, shadow=True, colormap='Pastel1')
        plt.title("Product Distribution by Category")
        plt.ylabel("")
        plt.tight_layout()
        plt.savefig("category_distribution.png")
        plt.show()
    else:
        print("⚠️ Column 'category' not found.")

# Analyze average price per brand
def analyze_average_price_per_brand(products_df):
    print("\n📈 Average Price per Brand:")
    if 'brand' in products_df.columns and 'price' in products_df.columns:
        avg_price = products_df.groupby('brand')['price'].mean().sort_values(ascending=False)
        print(avg_price)

        # Visualization
        plt.figure(figsize=(10,6))
        sns.barplot(x=avg_price.index, y=avg_price.values, palette="coolwarm")
        plt.title("Average Price per Brand")
        plt.xlabel("Brand")
        plt.ylabel("Average Price")
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig("avg_price_brand.png")
        plt.show()
    else:
        print("⚠️ Columns 'brand' and/or 'price' not found.")

# Analyze total stock per brand
def analyze_stock_per_brand(products_df):
    print("\n📦 Total Stock per Brand:")
    if 'brand' in products_df.columns and 'stock' in products_df.columns:
        total_stock = products_df.groupby('brand')['stock'].sum().sort_values(ascending=False)
        print(total_stock)

        # Visualization
        plt.figure(figsize=(10,6))
        sns.barplot(x=total_stock.index, y=total_stock.values, palette="YlGnBu")
        plt.title("Total Stock per Brand")
        plt.xlabel("Brand")
        plt.ylabel("Stock Units")
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig("stock_per_brand.png")
        plt.show()
    else:
        print("⚠️ Columns 'brand' and/or 'stock' not found.")

# Main script
if __name__ == "__main__":
    mongo_uri = "mongodb+srv://saisourya678:saisourya@ecommercecluster.yn5af.mongodb.net/?retryWrites=true&w=majority&appName=ecommerceCluster"
    db_name = "test"

    db = connect_to_mongodb(mongo_uri, db_name)

    if db is not None:

        products_df = fetch_collection_data(db, "products")
        products_df = clean_products_data(products_df)


        if not products_df.empty:
            analyze_top_brands(products_df)
            analyze_category_product_count(products_df)
            analyze_average_price_per_brand(products_df)
            analyze_stock_per_brand(products_df)
        else:
            print("⚠️ No product data found!")
