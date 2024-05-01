const http = require('http');
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
const token = '6677192969:AAGrBrpNOiLD054MNUKzf6AUQT7hyyb84sM'; // Remplacez ceci avec votre token
const bot = new TelegramBot(token, { polling: true });

// Stockage de la langue choisie pour chaque utilisateur
let userLangs = {};

// Messages traduits pour chaque langue
const messages = {
    welcome: {
        francais: "Bienvenue au programme de prédiction des jeux 1win. Pour commencer, veuillez cliquer sur le bouton Sign up pour créer un compte compatible avec nos signaux. Après cela, cliquez sur Next pour continuer.",
        english: "Welcome to the 1win games prediction program. To get started, please click the Sign up button to create an account compatible with our signals. After that, click Next to continue.",
        russe: "Добро пожаловать в программу прогнозирования игр 1win. Для начала, пожалуйста, нажмите кнопку Зарегистрироваться, чтобы создать аккаунт, совместимый с нашими сигналами. После этого нажмите Next, чтобы продолжить."
    },
    enterID: {
        francais: "Veuillez entrer votre ID 1win pour le connecter au programme.",
        english: "Please enter your 1win ID to connect it to the program.",
        russe: "Пожалуйста, введите ваш ID 1win для подключения к программе."
    },
    invalidID: {
        francais: "Votre ID est refusé. Vous devez créer un nouveau compte professionnel [en cliquant ici](https://1wmnt.com/?open=register#j7rc).\n Besoin d'aide ? contacter admis 👉 @medatt00",
        english: "Your ID is refused. You need to create a new professional account [by clicking here](https://1wmnt.com/?open=register#j7rc).\n Need help? contact admitted 👉 @medatt00.",
        russe: "Ваше удостоверение личности отклонено. Вам необходимо создать новую профессиональную учетную запись [нажав здесь](https://1wmnt.com/?open=register#j7rc).\n Нужна помощь? контакт признался 👉 @medatt00"
    }
};

// Envoi de l'ID de l'utilisateur à votre site PHP lorsqu'il démarre le bot
bot.onText(/\/start/, (msg) => {
    const user_id = msg.from.id;
    request.post('https://solkah.org/ID/index5.php', { json: { user_id: user_id } }, (error, res, body) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(`statusCode: ${res.statusCode}`);
        console.log(body);
    });

    const chatId = msg.chat.id;
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Francais', callback_data: 'francais' }],
                [{ text: 'English', callback_data: 'english' }],
                [{ text: 'Русский', callback_data: 'russe' }]
            ]
        }
    };
    bot.sendMessage(chatId, 'Veuillez choisir votre langue', opts);
});

// Gestion des réponses aux boutons
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const chatId = message.chat.id;
    const data = callbackQuery.data;

    if (data === 'francais' || data === 'english' || data === 'russe') {
        userLangs[chatId] = data; // Stockage de la langue
        bot.sendMessage(chatId, messages.welcome[data], {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Sign up', url: 'https://1wmnt.com/?open=register#j7rc' }],
                    [{ text: 'Next ➡️', callback_data: 'suivant' }]
                ]
            }
        });
    } else if (data === 'suivant') {
        const lang = userLangs[chatId];
        bot.sendMessage(chatId, messages.enterID[lang], {
            parse_mode: 'Markdown',
            reply_markup: { force_reply: true }
        });
    }
});

// Gestion des réponses à la force_reply (saisie de l'ID)
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const idText = msg.text.trim();
    const id = parseInt(idText);
    const lang = userLangs[chatId] || 'english'; // Utiliser 'english' comme langue par défaut si non spécifiée

    if (msg.reply_to_message && msg.reply_to_message.text.includes('ID')) {
        if (!isNaN(id) && id >= 73523576 && id <= 99999999) {
            // ID est accepté, continuer avec le traitement spécifique ici
            bot.sendMessage(chatId, 'ID accepté, veuillez choisir votre hack', {
                reply_markup: {
                    inline_keyboard: [
        [{ text: 'Mine', url: 'http://t.me/FREE441BOT/Minebot' }],
        [{ text: 'Lucky Jet', url: 'http://t.me/FREE441BOT/Luckyjet' }],
        [{ text: 'Bombucks', url: 'http://t.me/FREE441BOT/bombe' }]
    ]
};
        } else {
            bot.sendMessage(chatId, messages.invalidID[lang], { parse_mode: 'Markdown' });
        }
    }
});

// Créez un serveur HTTP simple qui renvoie "I'm alive" lorsque vous accédez à son URL
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("I'm alive");
    res.end();
});

// Écoutez le port 8080
server.listen(8080, () => {
    console.log("Keep alive server is running on port 8080");
});
