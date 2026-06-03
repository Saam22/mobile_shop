const { MongoClient, ServerApiVersion } = require('mongodb');

// ⚠️ استبدل كلمة السر هنا بكلمة السر الحقيقية بتاعتك
const uri = "mongodb+srv://saadmohamed222200_db_user:ShopAdmin123!@cluster0.4dmvtya.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error("❌ Connection Error:", err.message);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);