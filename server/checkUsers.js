const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const List = require('./models/List');

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(async () => {
    console.log("DB Bağlantısı Başarılı - Listeleri Çekiyorum...");
    
    try {
        const users = await User.find({});
        console.log(`Veritabanında toplam ${users.length} adet kullanıcı var.`);
        
        const lists = await List.find({});
        console.log(`Veritabanında toplam ${lists.length} adet liste var.`);
        lists.forEach(list => {
            console.log(`- Title: ${list.title}, Type: ${list.type}, Owner: ${list.owner}, Items: ${list.contentItems.length}`);
        });

    } catch (err) {
        console.error("Hata:", err);
    } finally {
        mongoose.connection.close();
    }
}).catch((err) => {
    console.error("DB Bağlantı Hatası:", err);
});
