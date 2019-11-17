telegramApi.setConfig({
    app: {
        id: 1166576 /* App ID */,
        hash: '99db6db0082e27973ee4357e4637aadc' /* App hash */,
        version: '0.0.1' /* App version */,
    },
    server: {
        test: [
            {
                id: 2 /* DC ID */,
                host: '149.154.167.40',
                port: 443,
            },
        ],
        production: [
            {
                id: 2 /* DC ID */,
                host: '149.154.167.50',
                port: 443,
            },
        ],
    },
});

export class CountryApiService {
    _apiBase = 'https://restcountries.eu/rest/v2';

    _transformCountry = countryData => {
        return {
            flagUrl: countryData.flag,
            name: countryData.name,
            code: countryData.callingCodes[0],
            alpha: countryData.alpha2Code,
        };
    };

    getResource = async url => {
        const res = await fetch(`${this._apiBase}${url}`, {
            method: 'GET',
        });

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${url}, received ${res.status}`);
        }

        return res.json();
    };

    getAllCountries = async () => {
        const res = await this.getResource('/all');

        return res.map(this._transformCountry);
    };
}

export class TelegramApiWrapper {
    _convertDate = date => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let time = new Date(date * 1000);
        const currentTime = new Date();

        const startOfTheWeek = date => {
            const now = date ? new Date(date) : new Date();
            now.setHours(0, 0, 0, 0);
            const monday = new Date(now);
            monday.setDate(1);
            return monday;
        };

        const formatTime = t => t < 10 ? "0" + t : t;

        if (time.getDay() - currentTime.getDay() === 0) {
            time = `${formatTime(time.getHours())}:${formatTime(time.getMinutes())}`;
        } else if (time.getDay() > startOfTheWeek(time)) {
            time = days[time.getDay()];
        } else {
            time = time.toLocaleDateString().replace(/[/]/g, '.');
            time = time.slice(0, 6) + time.slice(8);
        }

        return time;
    };

    spamMyself = async message => {
        telegramApi.invokeApi('messages.sendMessage', {
            peer: {
                _: 'inputPeerSelf',
            },
            message,
            random_id: Math.round(Math.random() * 100000),
        });
    };

    getDialogs = async limit => {
        const { result } = await telegramApi.getDialogs(0, limit);
        console.log('CHATS', result);

        const { chats, dialogs, messages, users } = result;
        // console.log(users);
        
        const dialog_items = [];

        await dialogs.forEach(async (dialog) => {
            let peer = dialog.peer;
            let title, status, onlineInfo;
            if (peer._ === 'peerChat') {
                title = chats[chats.findIndex(el => el.id === peer.chat_id)].title;
            } else if (peer._ === 'peerChannel') {
                const idx = chats.findIndex(el => el.id === peer.channel_id);
                const channel = chats[idx];
                title = channel.title;
                peer = {
                    ...peer,
                    access_hash: channel.access_hash
                };
                console.log(channel);
                if (chats[idx + 1]._ === 'chatForbidden') {
                    peer = {
                        ...peer,
                        chatForbidden: true
                    }
                }
            } else {
                const user = users[users.findIndex(el => el.id === peer.user_id)];
                const last_name = user.last_name ? ' ' + user.last_name : ''
                title = user.first_name + last_name;
                status = user.status;
                peer = user.access_hash ? {
                    ...peer,
                    access_hash: user.access_hash
                } : peer;
            }
            const message = messages[messages.findIndex(el => el.id === dialog.top_message)];
            const { message: text, date } = message;
            const unread_count = dialog.unread_count;


            dialog_items.push({
                title: title,
                isOnline: status && (status._ === 'userStatusOnline'),
                text: text,
                time: this._convertDate(date),
                unreadCount: unread_count,
                dialog_peer: peer
            });
        });

        dialog_items.sort((a, b) => a.time - b.time);

        // console.log(dialog_items);

        return dialog_items;
    };

    mapPeerToTruePeer = peer => {
        const type = peer._;
        if (type === 'peerUser') {
            return {
                ...peer,
                _: 'inputPeerUser',
                user_id: peer.user_id.toString(),
            };
        } else if (type === 'peerChat') {
            return {
                ...peer,
                _: 'inputPeerChat',
                chat_id: peer.chat_id.toString(),
            };
        } else if (type === 'peerChannel') {
            return {
                ...peer,
                _: 'inputPeerChannel',
                channel_id: peer.channel_id.toString(),
            };
        }
        return peer;
    };

    searchPeers = async (subsrt, limit) => {
        const res = await telegramApi.invokeApi('contacts.search', {
            q: subsrt,
            limit
        });

        console.log(res);
        const { results, users, chats } = res;

        const search_items = [];

        await results.forEach(async result => {
            let peer, title, text, photo;

            if (result._ === 'peerChat') {
                const chat = chats[chats.findIndex(el => el.id === result.chat_id)];
                title = chat.title;
                text = chat.participants_count > 1 ? chat.participants_count + ' members' : chat.participants_count + ' member';
                peer = {
                    ...result,
                    access_hash: chat.access_hash
                };
            } else if (result._ === 'peerChannel') {
                const channel = chats[chats.findIndex(el => el.id === result.channel_id)];
                title = channel.title;
                text = channel.participants_count > 1 ? channel.participants_count + ' members' : channel.participants_count + ' member';
                peer = {
                    ...result,
                    access_hash: channel.access_hash
                };
            } else {
                const user = users[users.findIndex(el => el.id === result.user_id)];
                const last_name = user.last_name ? ' ' + user.last_name : ''
                title = user.first_name + last_name;
                status = user.status;
                text = '@' + user.username;
                peer = user.access_hash ? {
                    ...result,
                    access_hash: user.access_hash
                } : result;
            }


            search_items.push({
                title,
                peer,
                text,
                status,
                photo
            });
        });

        return search_items;
    }

    getMessagesFromPeer = async (peer, limit = 200, offsetId = 0) => {
        console.log('Got peer', peer);
        console.log('Will try to send', this.mapPeerToTruePeer(peer));
        return await telegramApi.invokeApi('messages.getHistory', {
            peer: this.mapPeerToTruePeer(peer),
            limit,
            offset_id: offsetId
        });
    };
}
