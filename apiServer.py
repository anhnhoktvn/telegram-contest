from telethon import TelegramClient, events, sync

# These example values won't work. You must get your own api_id and
# api_hash from https://my.telegram.org, under API Development.
print('Hello')
api_id = 1166576
api_hash = '99db6db0082e27973ee4357e4637aadc'

client = TelegramClient('session_name', api_id, api_hash)
client.start()

print(client.get_me().stringify())

client.send_message('username', 'Hello! Talking to you from Telethon')
client.send_file('username', '/home/myself/Pictures/holidays.jpg')

client.download_profile_photo('me')
messages = client.get_messages('username')
messages[0].download_media()


@client.on(events.NewMessage(pattern='(?i)hi|hello'))
async def handler(event):
    await event.respond('Hey!')
