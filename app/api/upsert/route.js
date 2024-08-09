import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { NextResponse } from 'next/server';

// Initialize Pinecone
const pc = new Pinecone({
  apiKey: process.env.NEXT_PINECONE_API,
});
const index = pc.index('kingsmen');

export async function POST(req) {
  try {
    // Define the data within the code
    const data = {
      "store": {
        "name": "Fashion Haven",
        "address": "123 Fashion Street, Style City, SC 45678",
        "owner": {
          "name": "Sophia Carter",
          "contact": {
            "email": "sophia.carter@fashionhaven.com",
            "phone": "+1-234-567-890"
          }
        },
        "contacts": {
          "email": "support@fashionhaven.com",
          "phone": "+1-234-567-890",
          "socialMedia": {
            "instagram": "fashionhaven",
            "facebook": "FashionHavenOfficial"
          }
        },
        "products": [
          {
            "id": 201,
            "name": "Elegant Silk Scarf",
            "description": "A luxurious silk scarf available in various colors.",
            "price": "$45",
            "availability": "In Stock"
          },
          {
            "id": 202,
            "name": "Leather Handbag",
            "description": "A premium leather handbag perfect for any occasion.",
            "price": "$120",
            "availability": "Limited Stock"
          }
        ],
        "sales": [
          {
            "id": 301,
            "product_id": 201,
            "date": "2024-08-01",
            "quantity": 15,
            "totalAmount": "$675"
          },
          {
            "id": 302,
            "product_id": 202,
            "date": "2024-08-05",
            "quantity": 5,
            "totalAmount": "$600"
          }
        ]
      }
    };
    const embeddings = await generateStoreEmbeddings(data);
    await index.namespace('ns1').upsert(embeddings);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // console.error('Error processing data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

const generateStoreEmbeddings = async (data) => {
  const api = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_AIML_API, baseURL: 'https://api.aimlapi.com' });
  const embeddings = [];

  // Create embedding for store information
  const storeText = `${data.store.name} located at ${data.store.address}, owned by ${data.store.owner.name}. Contact: ${data.store.owner.contact.email}, ${data.store.owner.contact.phone}. Store Contact: ${data.store.contacts.email}, ${data.store.contacts.phone}`;
  try {
    const storeResponse = await api.embeddings.create({
      input: storeText,
      model: 'text-embedding-3-small',
    });
    if (storeResponse && storeResponse.data && storeResponse.data.length > 0) {
      const storeEmbedding = storeResponse.data[0].embedding;
      embeddings.push({
        id: "store-info",
        values: storeEmbedding,
      });
    }
  } catch (error) {
    // console.error('Error generating embeddings for store:', error);
  }

  // Iterate over each product in the products array
  for (const product of data.store.products) {
    const productText = `${product.name} ${product.description} Price: ${product.price}, Availability: ${product.availability}`;
    try {
      const productResponse = await api.embeddings.create({
        input: productText,
        model: 'text-embedding-3-small',
      });

      if (productResponse && productResponse.data && productResponse.data.length > 0) {
        const productEmbedding = productResponse.data[0].embedding;
        embeddings.push({
          id: `product-${product.id}`,
          values: productEmbedding,
        });
      }
    } catch (error) {
      // console.error(`Error generating embeddings for product with id ${product.id}:`, error);
    }
  }

  // Iterate over each sale in the sales array
  for (const sale of data.store.sales) {
    const saleText = `Sale ID: ${sale.id}, Product ID: ${sale.product_id}, Date: ${sale.date}, Quantity: ${sale.quantity}, Total Amount: ${sale.totalAmount}`;
    try {
      const saleResponse = await api.embeddings.create({
        input: saleText,
        model: 'text-embedding-3-small',
      });

      if (saleResponse && saleResponse.data && saleResponse.data.length > 0) {
        const saleEmbedding = saleResponse.data[0].embedding;
        embeddings.push({
          id: `sale-${sale.id}`,
          values: saleEmbedding,
        });
      }
    } catch (error) {
      // console.error(`Error generating embeddings for sale with id ${sale.id}:`, error);
    }
  }
  return embeddings;
};






